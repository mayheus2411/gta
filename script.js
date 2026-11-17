
let nome = document.querySelector(".nome");
let personagem = document.querySelector(".personagem");

function escolherPersonagem(nomePersonagem, imagemPersonagem, cor) {
    nome.textContent = nomePersonagem;
    personagem.src = imagemPersonagem;
    nome.style.color = cor;
}

async function lerFoto(foto) {

    const arquivo = foto.files[0];

    if (!arquivo) {
        alert("Escolha uma foto!");
        return;
    }

    if (!arquivo.type.startsWith("image/")) {
        alert("Escolha um arquivo de imagem válido!");
        foto.value = "";
        return;
    }

    nome.textContent = "Gerando personagem...";

    try {

        // Verifica se a Puter foi carregada
        if (typeof puter === "undefined") {
            throw new Error("A biblioteca Puter não foi carregada.");
        }

        // Converte a foto para Base64
        const imagemBase64 = await new Promise((resolve, reject) => {

            const leitor = new FileReader();

            leitor.onload = () => resolve(leitor.result);
            leitor.onerror = () => reject(new Error("Erro ao ler a foto."));

            leitor.readAsDataURL(arquivo);

        });

        // Gera o personagem usando a foto enviada
        const desenho = await puter.ai.txt2img(
            "Transform this person into a video game character. " +
            "Keep the person's face and recognizable facial features. " +
            "Use bold black outlines, vivid colors, " +
            "GTA-inspired illustrated character design, " +
            "half-body portrait, transparent background.",
            {
                model: "gpt-image-2.5-flare",
                provider: "openai",
                input_image: imagemBase64,
                quality: "medium"
            }
        );

        // Verifica o resultado
        if (!desenho) {
            throw new Error("A API não retornou uma imagem.");
        }

        // Atualiza o personagem na tela
        escolherPersonagem(
            "Você",
            desenho.src,
            "#b9b604"
        );

    } catch (erro) {

        console.error("ERRO COMPLETO:", erro);

        nome.textContent = "Erro ao gerar personagem";

        alert("Não foi possível gerar o personagem: " +
            (erro.message || erro));

    } finally {

        foto.value = "";

    }
}








