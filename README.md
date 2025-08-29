# StayLy 🏨

**StayLy** é um sistema web de **gerenciamento de pousadas**, que permite o controle digital de quartos **ocupados, reservados e disponíveis**.
O sistema conta com autenticação de usuários via **Firebase Authentication** e gerenciamento de dados em tempo real utilizando o **Firestore Database**.

---

## ✨ Funcionalidades

* 🔑 **Login seguro** com Firebase Authentication (e-mail/senha, Google).
* 👤 **Controle de usuários autenticados** (redirecionamento automático se não estiver logado).
* 🏠 **Dashboard interativo**:

  * Resumo de quartos (ocupados, reservados, disponíveis, total).
  * Tabela detalhada com informações de hóspedes e quartos.
  * Modal para **adicionar, editar ou excluir quartos**.
* 📅 Controle de **check-in** e **saída prevista**.
* 🚗 Registro de **veículo do hóspede** (tipo, marca, modelo, placa).
* 💰 Gestão de valores de cada quarto.
* 📊 Atualização automática dos **resumos** conforme os dados no Firestore.
* 🚪 Botão de logout para encerrar a sessão.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend**:

  * HTML5, CSS3, JavaScript (moderno ES6+).
  * [Font Awesome](https://fontawesome.com/) para ícones.

* **Backend/Database**:

  * [Firebase Authentication](https://firebase.google.com/docs/auth) (login e controle de sessão).
  * [Firebase Firestore](https://firebase.google.com/docs/firestore) (armazenamento de quartos e dados).

* **Outros**:

  * Estrutura modular de scripts (`login.js`, `main.js`).
  * Modais dinâmicos para CRUD de quartos.

---

## 📂 Estrutura de Pastas

```
StayLy/
│── index.html          # Tela de login
│── pages/
│   └── home.html       # Dashboard principal
│── style/
│   ├── login.css       # Estilo da tela de login
│   └── style.css       # Estilo do dashboard
│── script/
│   ├── login.js        # Lógica de autenticação
│   └── main.js         # Lógica de CRUD dos quartos
│── assets/
│   ├── icon.png        # Ícone do dashboard
│   └── logo.png        # Logo do sistema
│── README.md           # Documentação
```

---

## 🚀 Como Executar o Projeto

1. Clone este repositório:

   ```bash
   git clone https://github.com/seu-usuario/stayly.git
   ```

2. Abra a pasta do projeto:

   ```bash
   cd stayly
   ```

3. Configure seu projeto no [Firebase](https://firebase.google.com/):

   * Crie um **novo projeto Firebase**.
   * Ative **Authentication** (modo e-mail/senha e/ou Google).
   * Crie uma coleção no **Firestore** chamada `rooms`.
   * Copie suas credenciais do Firebase e substitua no código (`firebaseConfig`).

4. Inicie o projeto localmente:

   * Abra o arquivo `index.html` no navegador.
   * Faça login com um usuário criado no Firebase.
   * Acesse o **dashboard** e comece a gerenciar os quartos.

---

## 📸 Demonstração (prints)

🔐 **Tela de Login**
*Formulário simples e funcional com autenticação Firebase.*

📊 **Dashboard StayLy**
*Resumo visual dos quartos e tabela interativa.*

📝 **Modal de Cadastro/Edição de Quarto**
*Formulário completo com dados do hóspede e veículo.*

---

## 🔮 Próximos Passos

* [ ] Implementar **recuperação de senha** no login.
* [ ] Adicionar **upload de imagens** para hóspedes/quartos.
* [ ] Criar **gráficos analíticos** (ocupação por período).
* [ ] Melhorar **responsividade mobile**.

---

## 👨‍💻 Autor

Projeto desenvolvido por **Senhor Victor (Milorde)** ✨
🚀 Engenharia de Software | Full-Stack Developer