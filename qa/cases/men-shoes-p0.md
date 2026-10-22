# Casos P0 — Men's Shoes (American Eagle)

## Escopo da pesquisa

- **Página:** <https://www.ae.com/us/en/c/men/shoes/cat4840024>
- **Pesquisa:** inspeção rápida, somente leitura, do conteúdo HTML servido para a URL.
- **Observado:** título `Men's Shoes & Sneakers | American Eagle`, cabeçalho `Men's Shoes`, cards de produtos e controles `Filter + Sort` com filtros de categoria, marcas, tamanho e preço. A ordenação oferece Featured, Price: Low to High, Price: High to Low, Newest e Online Exclusives.
- **Limitação:** a sessão do navegador Playwright não iniciou. Os casos abaixo foram identificados a partir do conteúdo servido; interações e resultados ainda precisam ser validados em navegador.
- **Critério de prioridade:** P0 significa bloqueador do fluxo principal de descoberta e seleção de calçado nesta página. A prioridade não representa severidade de defeito.
- **Persona:** cliente sem autenticação, comprando calçados masculinos nos EUA.
- **Localização de teste:** permissão de geolocalização habilitada na spec, com coordenadas aproximadas do CEP 10022 (Midtown Manhattan); precisão configurada em 1.000 m. Não representa um endereço exato.
- **Execução:** NOT_RUN — pesquisa exploratória não substitui a execução dos casos.

## Casos de teste

### AE-MSH-P0-001 — Abrir a categoria e visualizar produtos

- **Critério:** a URL da categoria apresenta a página de calçados masculinos e produtos que podem ser selecionados.
- **Cenário:** cliente acessa diretamente a categoria.
- **Pré-condições/dados:** navegador sem sessão autenticada; conexão disponível; URL da página acima.
- **Passos:**
  1. Abrir a URL diretamente.
  2. Aguardar a renderização do conteúdo principal.
  3. Verificar o título/cabeçalho da categoria e os cards de produtos.
- **Resultado esperado:** a página apresenta o título/cabeçalho de calçados masculinos, ao menos um card com nome e preço, e controles de filtro/ordenação utilizáveis; não exibe estado de erro ou lista vazia quando há produtos disponíveis.
- **Prioridade:** P0 — sem a categoria e seus produtos, o fluxo principal de compra não começa.
- **Status:** NOT_RUN.
- **Automação:** `tests/ae-mens-shoes.spec.ts` — `AE-MSH-P0-001 @p0`.
- **Evidência:** conteúdo HTML consultado na URL indicada; foram encontrados cards como “Birkenstock Men's Boston Soft Footbed Clog” e “AE Suede Slipper”. Verificar a renderização visual no navegador.

### AE-MSH-P0-002 — Abrir um produto a partir do card

- **Critério:** o cliente consegue sair da listagem para a página de detalhe do produto escolhido.
- **Cenário:** cliente seleciona um calçado exibido na categoria.
- **Pré-condições/dados:** página carregada com pelo menos um card selecionável.
- **Passos:**
  1. Registrar o nome de um produto visível.
  2. Abrir o produto pelo card ou pelo link acessível associado.
  3. Verificar a página de destino e o produto apresentado.
- **Resultado esperado:** a navegação chega à página de detalhe do produto selecionado, e o nome/identidade do produto corresponde ao card de origem; não deve abrir um produto diferente nem uma página indisponível.
- **Prioridade:** P0 — essa navegação conecta a descoberta na categoria à avaliação do item para compra.
- **Status:** NOT_RUN.
- **Automação:** `tests/ae-mens-shoes.spec.ts` — `AE-MSH-P0-002 @p0`.
- **Evidência:** a resposta da página inclui links de produto, por exemplo, para “Birkenstock Men's Boston Soft Footbed Clog”. Destino e identidade após clique não foram verificados.

### AE-MSH-P0-003 — Filtrar a listagem por tamanho

- **Critério:** o filtro de tamanho ajuda o cliente a encontrar produtos adequados ao tamanho selecionado.
- **Cenário:** cliente restringe a categoria a calçados disponíveis em um tamanho.
- **Pré-condições/dados:** página carregada; selecionar um tamanho que esteja disponível em pelo menos um produto no ambiente.
- **Passos:**
  1. Abrir `Filter + Sort` e o filtro `Size`.
  2. Selecionar um tamanho disponível.
  3. Aguardar a atualização da listagem e conferir o filtro aplicado.
- **Resultado esperado:** a seleção fica identificável como filtro ativo e a listagem é atualizada para refletir a seleção, sem erro de interface. Se nenhum produto corresponder aos filtros aplicados, deve ser apresentado um estado vazio explícito e recuperável, permitindo remover o filtro.
- **Prioridade:** P0 — encontrar um tamanho comprável é essencial para selecionar um calçado adequado.
- **Status:** NOT_RUN.
- **Automação:** `tests/ae-mens-shoes.spec.ts` — `AE-MSH-P0-003 @p0`.
- **Evidência:** o controle `Size` aparece na resposta HTML da página; opções, atualização dos resultados e comportamento de estado vazio não foram verificados interativamente.

## Fora do P0 desta rodada

A ordenação por preço/data e os filtros de categoria, marca e preço foram observados, mas não classificados como P0: não impedem, por si só, o acesso à listagem e a seleção de um produto. Recomenda-se cobri-los como P1, validando cada critério e a persistência/remoção do filtro no navegador.
