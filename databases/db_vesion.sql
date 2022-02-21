-- 21/02/2022
CREATE TABLE IF NOT EXISTS imagens_produtos (
    id_imagem INT not null PRIMARY KEY AUTO_INCREMENT,
    id_produto INT,
    caminho VARCHAR(255),
    FOREIGN KEY (id_produto) REFERENCES produtos (id_produto)
);