# Text-to-Speech App - Aplicativo de Conversão de Texto em Fala  


Este projeto foi desenvolvido em grupo na cadeira de Resolução de problemas 6 implementa um aplicativo **Text-to-Speech (TTS)** que converte arquivos de texto enviados em áudio falado. A aplicação possui um **backend**, responsável pelo processamento e geração do áudio, e um **frontend** para a interface de envio e controle. Para testes, é necessário um emulador Android configurado.  

---

## Tecnologias
* React Native
* TypeScript
* Node.js
* Prisma
* Supabase
* PostgreSQL

---

## Pré-requisitos  

Certifique-se de ter as ferramentas e dependências listadas abaixo instaladas em seu sistema:  

- **Node.js** >= 14.x  
- **pnpm** >= 7.x  
- **Yarn** >= 1.22  
- **Android Studio** ou outro emulador Android configurado  

---

## Como Usar  

### Configuração do Backend  

1. Navegue até o diretório `backend`:  
   ```bash  
   cd backend  
   ```  
2. Instale as dependências utilizando o **pnpm**:  
   ```bash  
   pnpm install  
   ```  
3. Inicie o servidor backend:  
   ```bash  
   pnpm dev  
   ```  

O backend será executado na porta padrão (por exemplo, `http://localhost:3000`).  

---

### Configuração do Frontend  

1. Navegue até o diretório `frontend`:  
   ```bash  
   cd frontend  
   ```  
2. Instale as dependências utilizando o **Yarn**:  
   ```bash  
   yarn install  
   ```  
3. Inicie o aplicativo frontend:  
   ```bash  
   yarn start  
   ```  

Certifique-se de que o emulador Android está ativo para que a interface seja carregada corretamente.  

---

## Funcionalidades Disponíveis  

1. **Upload de Arquivos de Texto**  
   O usuário pode enviar arquivos `.pdf` ou `.doc`, e o conteúdo será processado para conversão em áudio.  

2. **Conversão de Texto em Fala**  
   Após o envio do arquivo, o texto será lido e convertido em áudio falado.  

3. **Configuração de Voz**  
   O aplicativo permite ajustar velocidade, tom e idioma da fala gerada.  

4. **Compatibilidade com Android**  
   O frontend foi desenvolvido para rodar em dispositivos Android, sendo necessário um emulador para testes.  

---

Desfrute do aplicativo e simplifique a leitura de arquivos com voz! 📂🎤🚀  
