import {
  BrowserSDK,
  AddressType,
  waitForPhantomExtension,
  isMobileDevice,
  getDeeplinkToPhantom,
} from "@phantom/browser-sdk";
import { VersionedTransaction } from "@solana/web3.js";
import QRCode from "qrcode";

const metaApi = document.querySelector('meta[name="crypto-pay-api"]');
const metaNetwork = document.querySelector('meta[name="crypto-pay-network"]');
const API = metaApi?.content?.replace(/\/$/, "") || "";
const NETWORK = metaNetwork?.content || "devnet";

const $ = (id) => document.getElementById(id);

const els = {
  formSection: $("form-section"),
  checkoutSection: $("checkout-section"),
  form: $("pay-form"),
  amount: $("amount-usd"),
  note: $("pay-note"),
  email: $("pay-email"),
  noteCount: $("note-count"),
  amountHint: $("amount-hint"),
  formError: $("form-error"),
  statusLive: $("status-live"),
  orderAmount: $("order-amount"),
  recipient: $("recipient"),
  copyRecipient: $("copy-recipient"),
  expiry: $("expiry-countdown"),
  qrCanvas: $("qr-canvas"),
  phantomConnect: $("phantom-connect"),
  phantomPay: $("phantom-pay"),
  phantomDisconnect: $("phantom-disconnect"),
  phantomWallet: $("phantom-wallet"),
  openInPhantom: $("open-in-phantom"),
  phantomPanel: $("phantom-panel"),
  qrOnlyHint: $("qr-only-hint"),
  startOver: $("start-over"),
  paidBlock: $("paid-block"),
  explorerLink: $("explorer-link"),
};

let config = null;
let order = null;
let payer = null;
let pollTimer = null;
let expiryTimer = null;
let sdk = null;

function initSdk() {
  if (!sdk) {
    sdk = new BrowserSDK({
      providers: ["injected"],
      addressTypes: [AddressType.solana],
    });
    sdk.on("disconnect", () => {
      payer = null;
      setPhantomUi("connect");
    });
    sdk.on("connect_error", (err) => {
      showStatus(`Connection failed: ${friendlyPhantom(err)}`, "error");
    });
    sdk.on("error", (err) => {
      showStatus(friendlyPhantom(err), "error");
    });
  }
  return sdk;
}

function showStatus(text, kind = "info") {
  if (!els.statusLive) return;
  els.statusLive.textContent = text;
  els.statusLive.dataset.kind = kind;
}

function stripControl(s) {
  return s.replace(/[\u0000-\u001F\u007F]/g, "").trim();
}

function validateEmail(email) {
  if (!email || email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function parseAmountUsd(raw) {
  const s = String(raw).trim();
  if (!/^\d+(\.\d{1,2})?$/.test(s)) return { ok: false, reason: "Enter a valid amount (up to 2 decimal places)." };
  const parts = s.split(".");
  if (parts[1] && parts[1].length > 2) return { ok: false, reason: "Use at most 2 decimal places." };
  const normalized = parts.length === 1 ? `${parts[0]}.00` : parts[1].length === 1 ? `${parts[0]}.${parts[1]}0` : s;
  if (!config) return { ok: true, value: normalized };
  const min = parseFloat(config.minUsd);
  const max = parseFloat(config.maxUsd);
  const n = parseFloat(normalized);
  if (Number.isNaN(n) || n < min || n > max) {
    return { ok: false, reason: `Amount must be between $${config.minUsd} and $${config.maxUsd}.` };
  }
  return { ok: true, value: formatAmountDisplay(normalized) };
}

function formatAmountDisplay(s) {
  const [intPart, dec = "00"] = s.split(".");
  const d = dec.padEnd(2, "0").slice(0, 2);
  return `${intPart}.${d}`;
}

function validateForm() {
  const amountR = parseAmountUsd(els.amount.value);
  const note = stripControl(els.note.value);
  const email = els.email.value.trim();
  if (!amountR.ok) return amountR.reason;
  if (note.length < 1 || note.length > 140) return "Describe what this payment is for (1–140 characters).";
  if (!validateEmail(email)) return "Enter a valid email address.";
  return null;
}

async function parseApiResponse(r) {
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const err =
      data && typeof data === "object" && !Array.isArray(data)
        ? { ...data }
        : { error: "request_failed", message: r.statusText || "Request failed" };
    err._httpStatus = r.status;
    throw err;
  }
  return data;
}

async function apiGet(path) {
  const r = await fetch(`${API}${path}`, { method: "GET", headers: { Accept: "application/json" } });
  return parseApiResponse(r);
}

async function apiPost(path, body) {
  const r = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  return parseApiResponse(r);
}

function friendlyApi(err) {
  if (!err || typeof err !== "object") return "Something went wrong. Please try again.";
  const code = err.error || err.code;
  const msg = err.message || "";
  if (err._httpStatus === 429 || code === "rate_limited") {
    return "Too many payment requests. Please wait a minute and try again.";
  }
  switch (code) {
    case "insufficient_usdc":
      return "Not enough devnet USDC in your wallet for this payment.";
    case "insufficient_sol":
      return "Not enough SOL for the network fee. Request a devnet SOL airdrop in Phantom.";
    case "merchant_not_ready":
      return "Merchant is not ready to receive USDC yet. Try again later or use the QR code.";
    case "order_expired":
    case "expired":
      return "This order expired. Start over with a new payment.";
    case "order_not_pending":
      return "This order is no longer open for payment. Start over if you need a new checkout.";
    default:
      return msg || code || "Request failed.";
  }
}

function friendlyPhantom(err) {
  const m = (err && (err.message || err.toString())) || "";
  if (/reject|denied|cancel/i.test(m)) return "You declined the request in Phantom.";
  if (/blockhash|network|cluster/i.test(m)) {
    return "Switch Phantom to Devnet: Settings → Developer Settings → Testnet Mode.";
  }
  return m || "Phantom error.";
}

function shortenAddress(addr) {
  if (!addr || addr.length < 12) return addr || "";
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

const TERMINAL_ORDER_STATUSES = ["paid", "expired", "needs_review", "refunded"];

function statusLabel(status, orderStatus) {
  switch (status) {
    case "pending":
      return "Waiting for payment…";
    case "seen":
      return "Payment seen — confirming on chain…";
    case "paid": {
      const base = "Paid ✓";
      if (orderStatus?.receivedAmount && orderStatus.receivedAmount !== orderStatus.amount) {
        return `${base} (${orderStatus.receivedAmount} USDC received)`;
      }
      return base;
    }
    case "expired":
      return "Order expired";
    case "needs_review":
      return "Payment needs review — we'll email you.";
    case "refunded":
      return "This payment was marked refunded.";
    default:
      return status || "…";
  }
}

function clearTimers() {
  if (pollTimer) clearTimeout(pollTimer);
  if (expiryTimer) clearInterval(expiryTimer);
  pollTimer = null;
  expiryTimer = null;
}

function showSection(which) {
  els.formSection.hidden = which !== "form";
  els.checkoutSection.hidden = which !== "checkout";
}

function setPhantomUi(mode) {
  els.phantomConnect.hidden = mode !== "connect";
  els.phantomPay.hidden = mode !== "pay";
  els.phantomDisconnect.hidden = mode !== "connect" && mode !== "pay" ? true : mode === "connect";
  if (els.phantomWallet) {
    els.phantomWallet.hidden = !payer;
    els.phantomWallet.textContent = payer ? shortenAddress(payer) : "";
  }
}

async function loadConfig() {
  config = await apiGet("/config");
  const net = config.network || NETWORK;
  if (els.amountHint && config.minUsd && config.maxUsd) {
    const label = config.label ? `${config.label} · ` : "";
    els.amountHint.textContent = `${label}USDC on Solana (${net}). $${config.minUsd} – $${config.maxUsd} per payment.`;
  }
  if (els.amount) {
    els.amount.min = config.minUsd;
    els.amount.max = config.maxUsd;
  }
}

async function createOrder(ev) {
  ev.preventDefault();
  els.formError.textContent = "";
  const err = validateForm();
  if (err) {
    els.formError.textContent = err;
    return;
  }
  const amountR = parseAmountUsd(els.amount.value);
  // API: POST /orders — only amountUsd, note, email (extra fields → 422)
  const body = {
    amountUsd: amountR.value,
    note: stripControl(els.note.value),
    email: els.email.value.trim(),
  };
  try {
    order = await apiPost("/orders", body);
    await enterCheckout();
  } catch (e) {
    els.formError.textContent = friendlyApi(e);
  }
}

async function enterCheckout() {
  showSection("checkout");
  els.paidBlock.hidden = true;
  if (els.explorerLink) els.explorerLink.hidden = false;
  els.orderAmount.textContent = `${order.amount || order.amountUsd} USDC`;
  els.recipient.textContent = shortenAddress(order.recipient);
  els.recipient.dataset.full = order.recipient;

  const canvas = els.qrCanvas;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  await QRCode.toCanvas(canvas, order.solanaPayUrl, { width: 280, margin: 2 });

  if (els.openInPhantom) {
    els.openInPhantom.href = getDeeplinkToPhantom(location.origin, location.href);
    els.openInPhantom.hidden = !isMobileDevice();
  }

  initSdk();
  const hasExt = await waitForPhantomExtension(3000);
  els.phantomPanel.hidden = false;
  els.qrOnlyHint.hidden = hasExt || isMobileDevice();
  if (hasExt) {
    setPhantomUi("connect");
  } else if (isMobileDevice()) {
    setPhantomUi("connect");
    els.phantomConnect.hidden = true;
  } else {
    els.phantomConnect.hidden = true;
    els.phantomPay.hidden = true;
    els.phantomDisconnect.hidden = true;
  }

  startExpiryCountdown(order.expiresAt);
  showStatus(statusLabel("pending"), "info");
  schedulePoll();
}

function startExpiryCountdown(iso) {
  const end = new Date(iso).getTime();
  const tick = () => {
    const left = end - Date.now();
    if (left <= 0) {
      els.expiry.textContent = "Expired";
      return;
    }
    const m = Math.floor(left / 60000);
    const s = Math.floor((left % 60000) / 1000);
    els.expiry.textContent = `${m}:${String(s).padStart(2, "0")} remaining`;
  };
  tick();
  expiryTimer = setInterval(tick, 1000);
}

async function connectPhantom() {
  try {
    const client = initSdk();
    const { addresses } = await client.connect({ provider: "injected" });
    const sol = addresses.find((a) => a.addressType === AddressType.solana);
    payer = sol?.address;
    if (!payer) throw new Error("No Solana address returned from Phantom.");
    setPhantomUi("pay");
    showStatus("Phantom connected. Click Pay to send USDC.", "info");
  } catch (e) {
    showStatus(friendlyPhantom(e), "error");
  }
}

async function payWithPhantom() {
  if (!order || !payer) return;
  try {
    showStatus("Opening Phantom…", "info");
    const { transaction, message } = await apiPost(`/orders/${order.orderId}/tx`, { account: payer });
    const raw = Uint8Array.from(atob(transaction), (c) => c.charCodeAt(0));
    const tx = VersionedTransaction.deserialize(raw);
    const client = initSdk();
    const { signature } = await client.solana.signAndSendTransaction(tx);
    showStatus(`Transaction sent: ${shortenAddress(signature)}`, "info");
    if (message) console.info(message);
  } catch (e) {
    if (e && (e.error || e._httpStatus)) {
      showStatus(friendlyApi(e), "error");
      if (e.error === "order_expired" || e.error === "order_not_pending" || e._httpStatus === 409) {
        if (els.startOver) els.startOver.hidden = false;
      }
    } else showStatus(friendlyPhantom(e), "error");
  }
}

async function disconnectPhantom() {
  try {
    await initSdk().disconnect();
  } catch (_) {
    /* ignore */
  }
  payer = null;
  setPhantomUi("connect");
}

function schedulePoll() {
  clearTimeout(pollTimer);
  pollTimer = setTimeout(pollOrder, 4000);
}

async function pollOrder() {
  if (!order?.orderId) return;
  try {
    const s = await apiGet(`/orders/${order.orderId}`);
    handleOrderStatus(s);
    if (!TERMINAL_ORDER_STATUSES.includes(s.status)) schedulePoll();
  } catch (e) {
    showStatus(friendlyApi(e), "error");
    schedulePoll();
  }
}

function handleOrderStatus(s) {
  showStatus(statusLabel(s.status, s), s.status === "paid" ? "success" : "info");
  if (s.status === "paid") {
    els.paidBlock.hidden = false;
    if (s.explorerUrl && els.explorerLink) {
      els.explorerLink.href = s.explorerUrl;
      els.explorerLink.textContent = "View on Solana Explorer";
    } else {
      els.explorerLink.hidden = true;
    }
    clearTimers();
  }
  if (s.status === "expired" || s.status === "refunded") {
    clearTimers();
    if (els.startOver) els.startOver.hidden = false;
  }
  if (s.status === "needs_review") clearTimers();
}

function resetCheckout() {
  clearTimers();
  order = null;
  payer = null;
  showSection("form");
  els.form.reset();
  els.noteCount.textContent = "0";
  els.startOver.hidden = true;
  showStatus("", "info");
}

function bindEvents() {
  els.form?.addEventListener("submit", createOrder);
  els.note?.addEventListener("input", () => {
    const n = stripControl(els.note.value).length;
    els.noteCount.textContent = String(Math.min(n, 140));
  });
  els.copyRecipient?.addEventListener("click", async () => {
    const full = els.recipient?.dataset.full;
    if (!full) return;
    try {
      await navigator.clipboard.writeText(full);
      showStatus("Recipient address copied.", "info");
    } catch {
      showStatus("Could not copy — select the address manually.", "error");
    }
  });
  els.phantomConnect?.addEventListener("click", connectPhantom);
  els.phantomPay?.addEventListener("click", payWithPhantom);
  els.phantomDisconnect?.addEventListener("click", disconnectPhantom);
  els.startOver?.addEventListener("click", resetCheckout);
}

async function boot() {
  if (!API) {
    showStatus("Missing crypto-pay-api meta tag.", "error");
    return;
  }
  bindEvents();
  try {
    await loadConfig();
  } catch (e) {
    els.formError.textContent =
      "Could not load payment config. Is the fulfillment API running? " + friendlyApi(e);
    const submit = els.form?.querySelector('button[type="submit"]');
    if (submit) submit.disabled = true;
  }
}

boot();
