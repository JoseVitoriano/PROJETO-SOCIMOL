const STORAGE_KEY = "cadastros_carregamento";

function getCadastros() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function salvarCadastros(cadastros) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cadastros));
}

function formatarData(data) {
  return new Date(data + "T00:00:00").toLocaleDateString("pt-BR");
}

function gerarId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCadastro");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const novoCadastro = {
        id: gerarId(),
        deposito: document.getElementById("deposito").value.trim(),
        motorista: document.getElementById("motorista").value.trim(),
        perfilVeiculo: document.getElementById("perfilVeiculo").value.trim(),
        cubagem: parseFloat(document.getElementById("cubagem").value),
        dataConclusao: document.getElementById("dataConclusao").value
      };

      const cadastros = getCadastros();
      cadastros.push(novoCadastro);
      salvarCadastros(cadastros);

      form.reset();
      alert("Cadastro salvo com sucesso!");
    });
  }

  const tbody = document.getElementById("tbodyCadastro");
  if (tbody) {
    renderTabela();
  }

  const totalCadastros = document.getElementById("totalCadastros");
  const mediaCubagem = document.getElementById("mediaCubagem");
  const cadastrosHoje = document.getElementById("cadastrosHoje");
  const depositosUnicos = document.getElementById("depositosUnicos");

  if (totalCadastros || mediaCubagem || cadastrosHoje || depositosUnicos) {
    const cadastros = getCadastros();
    const total = cadastros.length;
    const somaCubagem = cadastros.reduce((acc, item) => acc + Number(item.cubagem || 0), 0);
    const media = total ? (somaCubagem / total).toFixed(2) : "0.00";

    const hoje = new Date().toISOString().slice(0, 10);
    const hojeCount = cadastros.filter(item => item.dataConclusao === hoje).length;

    const depositos = new Set(cadastros.map(item => item.deposito.toLowerCase())).size;

    if (totalCadastros) totalCadastros.textContent = total;
    if (mediaCubagem) mediaCubagem.textContent = media;
    if (cadastrosHoje) cadastrosHoje.textContent = hojeCount;
    if (depositosUnicos) depositosUnicos.textContent = depositos;
  }
});

function renderTabela() {
  const tbody = document.getElementById("tbodyCadastro");
  const cadastros = getCadastros();

  if (!cadastros.length) {
    tbody.innerHTML = `<tr><td colspan="6">Nenhum cadastro encontrado.</td></tr>`;
    return;
  }

  tbody.innerHTML = cadastros.map(item => `
    <tr>
      <td>${item.deposito}</td>
      <td>${item.motorista}</td>
      <td>${item.perfilVeiculo}</td>
      <td>${item.cubagem}</td>
      <td>${formatarData(item.dataConclusao)}</td>
      <td>
        <button class="btn-danger" onclick="excluirCadastro('${item.id}')">Excluir</button>
      </td>
    </tr>
  `).join("");
}

function excluirCadastro(id) {
  const confirmar = confirm("Deseja realmente excluir este cadastro?");
  if (!confirmar) return;

  const cadastros = getCadastros().filter(item => item.id !== id);
  salvarCadastros(cadastros);

  if (document.getElementById("tbodyCadastro")) {
    renderTabela();
  }

  if (document.getElementById("totalCadastros")) {
    location.reload();
  }
}