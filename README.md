# Image Converter

Conversor simples de imagens executado no navegador.

## Como usar

1. Abra o `index.html` em um navegador moderno.
2. Selecione uma imagem com o campo **"Selecione uma imagem"**.
3. Escolha o formato de saída (PNG, JPEG ou WEBP).
4. Clique em **Converter** e depois em **Baixar Imagem** para salvar o arquivo convertido.

**Observações**

- A opção BMP foi removida por questões de compatibilidade entre navegadores; os formatos suportados são PNG, JPEG e WEBP.
- A conversão é feita inteiramente no cliente usando um elemento `canvas`; nenhuma imagem é enviada para servidores.
- Se o formato escolhido não for suportado pelo navegador, o conversor tenta gerar um PNG como fallback.
