// Canal simples para abrir e fechar o painel de contato de qualquer lugar.

const listeners = new Set();

export function openContact(need) {
  listeners.forEach((listener) => listener({ open: true, need }));
}

export function closeContact() {
  listeners.forEach((listener) => listener({ open: false }));
}

export function onContact(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
