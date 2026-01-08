document.addEventListener("DOMContentLoaded", function () {
  // Tema claro/escuro
  const toggleButton = document.querySelector("header nav button");
  const body = document.body;
  const icon = toggleButton.querySelector("i");

  toggleButton.addEventListener("click", function () {
    body.classList.toggle("dark-mode");
    if (body.classList.contains("dark-mode")) {
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
    } else {
      icon.classList.remove("fa-sun");
      icon.classList.add("fa-moon");
    }
  });

  // Conversão de imagens (canvas)
  const form = document.getElementById("imageForm");
  const imageInput = document.getElementById("imageInput");
  const formatSelect = document.getElementById("formatSelect");
  const result = document.getElementById("result");
  const downloadLink = document.getElementById("downloadLink");
  const convertedImg = document.getElementById("convertedImage");
  const status = document.getElementById("status");
  const submitBtn = form.querySelector('button[type="submit"]');

  // Rastreia a última URL de blob para liberar quando não for mais necessária
  let lastBlobUrl = null;

  function setBlobUrl(url) {
    if (lastBlobUrl) {
      try {
        URL.revokeObjectURL(lastBlobUrl);
      } catch (e) {
        /* ignorar */
      }
      lastBlobUrl = null;
    }
    lastBlobUrl = url;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.textContent = "";
    const file = imageInput.files[0];
    if (!file) {
      status.textContent = "Selecione uma imagem para converter.";
      return;
    }
    if (submitBtn) submitBtn.disabled = true;

    const mimeMap = {
      png: "image/png",
      jpeg: "image/jpeg",
      webp: "image/webp",
    };

    const selected = formatSelect.value;
    const mime = mimeMap[selected];

    if (!mime) {
      status.textContent = "Formato não suportado.";
      return;
    }

    const filenameBase = file.name.replace(/\.[^/.]+$/, "");
    const ext = selected === "jpeg" ? "jpg" : selected;

    const img = new Image();
    let inputUrl = null;
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      // Tentar gerar blob no formato escolhido
      canvas.toBlob(
        function (blob) {
          if (!blob) {
            // Fallback para PNG se o formato não for suportado
            canvas.toBlob(function (pblob) {
              if (!pblob) {
                status.textContent =
                  "Não foi possível converter a imagem neste navegador.";
                if (submitBtn) submitBtn.disabled = false;
                try {
                  if (inputUrl) URL.revokeObjectURL(inputUrl);
                } catch (e) {}
                return;
              }
              const url = URL.createObjectURL(pblob);
              setBlobUrl(url);
              downloadLink.href = url;
              downloadLink.download = filenameBase + ".png";
              convertedImg.src = url;
              result.style.display = "block";
              status.textContent =
                "Formato não suportado — gerado PNG como fallback.";
              if (submitBtn) submitBtn.disabled = false;
              try {
                if (inputUrl) URL.revokeObjectURL(inputUrl);
              } catch (e) {}
            }, "image/png");
            return;
          }

          const url = URL.createObjectURL(blob);
          setBlobUrl(url);
          downloadLink.href = url;
          downloadLink.download = filenameBase + "." + ext;
          convertedImg.src = url;
          result.style.display = "block";
          status.textContent = 'Pronto — clique em "Baixar Imagem".';
          if (submitBtn) submitBtn.disabled = false;
          try {
            if (inputUrl) URL.revokeObjectURL(inputUrl);
          } catch (e) {}
        },
        mime,
        selected === "jpeg" ? 0.92 : undefined
      );
    };

    img.onerror = function () {
      status.textContent = "Erro ao carregar a imagem selecionada.";
      if (submitBtn) submitBtn.disabled = false;
      try {
        if (inputUrl) URL.revokeObjectURL(inputUrl);
      } catch (e) {}
    };

    inputUrl = URL.createObjectURL(file);
    img.src = inputUrl;
    status.textContent = "Convertendo...";

    const main = document.querySelector("main");
    if (window.innerWidth >= 990) {
      main.style.gridArea = "2 / 1 / -2 / 2";
      result.style.gridArea = "2 / 2 / -1 / -1";
    } else {
      main.style.gridArea = "2 / 1 / -2 / -1";
      result.style.gridArea = "3 / 1 / -1 / -1";
    }
  });

  // Liberar URL de blobs depois do download
  downloadLink.addEventListener("click", function () {
    setTimeout(function () {
      if (
        convertedImg &&
        convertedImg.src &&
        convertedImg.src.startsWith("blob:")
      ) {
        URL.revokeObjectURL(convertedImg.src);
        convertedImg.src = "";
      }
      if (
        downloadLink &&
        downloadLink.href &&
        downloadLink.href.startsWith("blob:")
      ) {
        URL.revokeObjectURL(downloadLink.href);
      }
      if (lastBlobUrl) {
        try {
          URL.revokeObjectURL(lastBlobUrl);
        } catch (e) {
          /* ignorar */
        }
        lastBlobUrl = null;
      }
    }, 1000);
  });
});
