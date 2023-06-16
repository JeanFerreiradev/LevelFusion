var funcaoLogin = false;
var idProduto;
var emailUsuario;
function cadastrarCliente(nome, sobrenome, cpf, rg, email, senha) {
    var inputNome = document.getElementById('nome').value;
    var inputSobrenome = document.getElementById('sobrenome').value;
    var inputCPF = document.getElementById('CPF').value;
    var inputRG = document.getElementById('RG').value;
    var inputEmailCadastro = document.getElementById('emailCadastro').value;
    var inputSenhaCadastro = document.getElementById('senhaCadastro').value;
    if (inputNome === '' || inputSobrenome === '' || inputCPF === '' || inputRG === '' || inputEmailCadastro === '' || inputSenhaCadastro === '') {
        return;
    } else {
        fetch('/api/cadastrar-cliente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, sobrenome, cpf, rg, email, senha }),
        })
            .then((response) => response.json())
            .then((data) => {
            })
            .catch((error) => {
                console.error('Erro:', error);
            });
    }
}
function adicionarProdutoNoCarrinho(id) {
    idProduto = id;
    if (funcaoLogin) {
        var produtoDiv = document.getElementById(id);
        var nomeProduto = produtoDiv.querySelector('.nomeProduto').textContent;
        var precoProduto = produtoDiv.querySelector('.precoProduto').textContent;
        var imgProduto = produtoDiv.querySelector('.imgProduto').src;
        var precoProdutoBD = precoProduto.slice(3);

        var carrinhoProdutosDiv = document.getElementById('abaCarrinho');

        var produtoCarrinhoDiv = document.createElement('div');
        produtoCarrinhoDiv.className = 'produtoCarrinho';
        produtoCarrinhoDiv.classList.add('esseProduto');

        var imgProdutoCarrinhoDiv = document.createElement('div');
        imgProdutoCarrinhoDiv.id = 'imgProdutoCarrinho';
        imgProdutoCarrinhoDiv.innerHTML = '<img src="' + imgProduto + '" alt="imagem não encontrada">';

        var nomeProdutoCarrinhoDiv = document.createElement('div');
        nomeProdutoCarrinhoDiv.id = 'nomeProdutoCarrinho';
        nomeProdutoCarrinhoDiv.textContent = nomeProduto;

        var precoProdutoCarrinhoDiv = document.createElement('div');
        precoProdutoCarrinhoDiv.classList = 'precoProdutoCarrinho';
        precoProdutoCarrinhoDiv.textContent = precoProduto;

        produtoCarrinhoDiv.appendChild(imgProdutoCarrinhoDiv);
        produtoCarrinhoDiv.appendChild(nomeProdutoCarrinhoDiv);
        produtoCarrinhoDiv.appendChild(precoProdutoCarrinhoDiv);

        var divsProdutoCarrinho = document.getElementsByClassName('produtoCarrinho');
        var posicaoTop = divsProdutoCarrinho.length * 105; // 110 = altura da div produtoCarrinho + espaçamento vertical
        produtoCarrinhoDiv.style.top = posicaoTop + 'px';

        carrinhoProdutosDiv.appendChild(produtoCarrinhoDiv);
        atualizarValorTotal();
        fetch('/api/adicionar-produto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ emailUsuario, nomeProduto, precoProdutoBD, idProduto }),
        })
            .then((response) => response.json())
            .then((data) => {
            })
            .catch((error) => {
                console.error('Erro:', error);
            });
    }
}
function atualizarValorTotal() {
    var produtosCarrinho = document.querySelectorAll('.produtoCarrinho');
    var valorTotal = 0;

    produtosCarrinho.forEach(function (produtoCarrinho) {
        var precoProduto = produtoCarrinho.querySelector('.precoProdutoCarrinho').textContent;
        var precoNumerico = parseFloat(precoProduto.replace('R$ ', '').replace(',', '.'));

        if (!isNaN(precoNumerico)) {
            valorTotal += precoNumerico;
        }
    });

    var valorTotalDiv = document.getElementById('valorTotalCarrinho');
    if (valorTotalDiv) {
        valorTotalDiv.textContent = 'Valor Total: R$ ' + valorTotal.toFixed(2);
    } else {
        var novoValorTotalDiv = document.createElement('div');
        novoValorTotalDiv.id = 'valorTotalCarrinho';
        novoValorTotalDiv.textContent = 'Valor Total: R$ ' + valorTotal.toFixed(2);

        var abaCarrinhoDiv = document.getElementById('abaCarrinho');
        abaCarrinhoDiv.appendChild(novoValorTotalDiv);
    }
}


function realizarLogin(email, senha) {
    fetch('/api/info-cliente')
        .then((response) => response.json())
        .then((data) => {
            // Verificar se o email e senha correspondem a algum usuário
            const usuario = data.find((user) => user.email === email && user.senha === senha);

            if (usuario) {
                // Login bem-sucedido
                window.alert('Login realizado com sucesso!');
                var entrarCadastrar = document.getElementById('entrarCadastrar');
                var perfilNome = document.getElementById('perfilNome');
                perfilNome.textContent = `Bem-vindo, ${usuario.nome}!`;

                var abaLogin = document.getElementById('abaLogin');
                abaLogin.style.display = 'none';

                // Remover completamente o evento de clique do elemento entrarCadastrar
                entrarCadastrar.parentNode.replaceChild(entrarCadastrar.cloneNode(true), entrarCadastrar);
                funcaoLogin = true;
                emailUsuario = email;
            } else {
                // Login inválido
                window.alert('Email ou senha incorretos!');
            }
        })
        .catch((error) => {
            console.error('Erro:', error);
        });
}

function buscarCarrinhoUsuario(emailUsuario) {
    fetch('/api/carrinho/' + emailUsuario)
        .then((response) => response.json())
        .then((data) => {
            // Verificar se ocorreu algum erro ao buscar o carrinho do usuário
            console.log('dados retornados:', data);
            if (data.error) {
                console.error('Erro ao buscar carrinho do usuário:', data.error);
                return;
            }

            // Limpar os produtos do carrinho
            var carrinhoProdutosDiv = document.getElementById('abaCarrinho');

            // Adicionar os produtos do carrinho ao HTML
            data.forEach(function (produto) {
                var produtoDiv = document.getElementById(produto.idProduto);
                var imgProduto = produtoDiv.querySelector('.imgProduto').src;
                var produtoCarrinhoDiv = document.createElement('div');
                produtoCarrinhoDiv.className = 'produtoCarrinho';
                produtoCarrinhoDiv.classList.add('esseProduto');

                console.log('Produto:', produto);
                console.log('Nome do Produto:', produto.nomeProduto);
                console.log('Preço do Produto:', produto.precoProduto);
                var nomeProduto = produto.nomeProduto;
                var precoProduto = Number(produto.precoProduto);

                var imgProdutoCarrinhoDiv = document.createElement('div');
                imgProdutoCarrinhoDiv.id = 'imgProdutoCarrinho';
                imgProdutoCarrinhoDiv.innerHTML = '<img src="' + imgProduto + '" alt="imagem não encontrada">';

                var nomeProdutoCarrinhoDiv = document.createElement('div');
                nomeProdutoCarrinhoDiv.id = 'nomeProdutoCarrinho';
                nomeProdutoCarrinhoDiv.textContent = nomeProduto;

                var precoProdutoCarrinhoDiv = document.createElement('div');
                precoProdutoCarrinhoDiv.classList = 'precoProdutoCarrinho';
                precoProdutoCarrinhoDiv.textContent = 'R$ ' + precoProduto.toFixed(2);

                produtoCarrinhoDiv.appendChild(imgProdutoCarrinhoDiv);
                produtoCarrinhoDiv.appendChild(nomeProdutoCarrinhoDiv);
                produtoCarrinhoDiv.appendChild(precoProdutoCarrinhoDiv);

                var divsProdutoCarrinho = document.getElementsByClassName('produtoCarrinho');
                var posicaoTop = divsProdutoCarrinho.length * 105; // 110 = altura da div produtoCarrinho + espaçamento vertical
                produtoCarrinhoDiv.style.top = posicaoTop + 'px';

                carrinhoProdutosDiv.appendChild(produtoCarrinhoDiv);
            });

            atualizarValorTotal();
        })
        .catch((error) => {
            console.error('Erro:', error);
        });
}

fetch('/api/buscar-produto')
    .then(response => response.json())
    .then(data => {
        const produto = data.find(item => item.id === 1);
        if (produto) {
            var precoProduto = produto.preco;
            document.getElementById('nomeProduto1').textContent = produto.nome;
            document.getElementById('precoProduto1').textContent = 'R$ ' + precoProduto.toFixed(2);
        }
    })
    .catch(error => {
        console.error('Ocorreu um erro:', error);
    });
fetch('/api/buscar-produto')
    .then(response => response.json())
    .then(data => {
        const produto = data.find(item => item.id === 2);
        if (produto) {
            var precoProduto = produto.preco;
            document.getElementById('nomeProduto2').textContent = produto.nome;
            document.getElementById('precoProduto2').textContent = 'R$ ' + precoProduto.toFixed(2);
        }
    })
    .catch(error => {
        console.error('Ocorreu um erro:', error);
    });
fetch('/api/buscar-produto')
    .then(response => response.json())
    .then(data => {
        const produto = data.find(item => item.id === 3);
        if (produto) {
            var precoProduto = produto.preco;
            document.getElementById('nomeProduto3').textContent = produto.nome;
            document.getElementById('precoProduto3').textContent = 'R$ ' + precoProduto.toFixed(2);
        }
    })
    .catch(error => {
        console.error('Ocorreu um erro:', error);
    });
fetch('/api/buscar-produto')
    .then(response => response.json())
    .then(data => {
        const produto = data.find(item => item.id === 4);
        if (produto) {
            var precoProduto = produto.preco;
            document.getElementById('nomeProduto4').textContent = produto.nome;
            document.getElementById('precoProduto4').textContent = 'R$ ' + precoProduto.toFixed(2);
        }
    })
    .catch(error => {
        console.error('Ocorreu um erro:', error);
    });
fetch('/api/buscar-produto')
    .then(response => response.json())
    .then(data => {
        const produto = data.find(item => item.id === 5);
        if (produto) {
            var precoProduto = produto.preco;
            document.getElementById('nomeProduto5').textContent = produto.nome;
            document.getElementById('precoProduto5').textContent = 'R$ ' + precoProduto.toFixed(2);
        }
    })
    .catch(error => {
        console.error('Ocorreu um erro:', error);
    });
fetch('/api/buscar-produto')
    .then(response => response.json())
    .then(data => {
        const produto = data.find(item => item.id === 6);
        if (produto) {
            var precoProduto = produto.preco;
            document.getElementById('nomeProduto6').textContent = produto.nome;
            document.getElementById('precoProduto6').textContent = 'R$ ' + precoProduto.toFixed(2);
        }
    })
    .catch(error => {
        console.error('Ocorreu um erro:', error);
    });
fetch('/api/buscar-produto')
    .then(response => response.json())
    .then(data => {
        const produto = data.find(item => item.id === 7);
        if (produto) {
            var precoProduto = produto.preco;
            document.getElementById('nomeProduto7').textContent = produto.nome;
            document.getElementById('precoProduto7').textContent = 'R$ ' + precoProduto.toFixed(2);
        }
    })
    .catch(error => {
        console.error('Ocorreu um erro:', error);
    });
fetch('/api/buscar-produto')
    .then(response => response.json())
    .then(data => {
        const produto = data.find(item => item.id === 8);
        if (produto) {
            var precoProduto = produto.preco;
            document.getElementById('nomeProduto8').textContent = produto.nome;
            document.getElementById('precoProduto8').textContent = 'R$ ' + precoProduto.toFixed(2);
        }
    })
    .catch(error => {
        console.error('Ocorreu um erro:', error);
    });
function buscarNome(id) {
    fetch('/api/buscar-nome')
        .then(response => response.json())
        .then(data => {
            const produto = data[0];
            document.getElementById('nomeProduto' + id).textContent = produto.nome;
        })
        .catch(error => {
            console.error('Ocorreu um erro:', error);
        });
}
function buscarPreco(id) {
    fetch('/api/buscar-preco')
        .then(response => response.json())
        .then(data => {
            const produto = data[0];
            document.getElementById('precoProduto' + id).textContent = produto.preco;
        })
        .catch(error => {
            console.error('Ocorreu um erro:', error);
        });
}
function openTabCompraRealizada() {
    removerProdutos();
    var compraRealizadaDiv = document.getElementById('compraRealizada');
    compraRealizadaDiv.style.display = 'block';
    compraRealizadaDiv.classList.add('mostrar');

    var tempoExibicao = 2100;

    setTimeout(function () {
        compraRealizadaDiv.classList.remove('mostrar');

        setTimeout(function () {
            compraRealizadaDiv.style.display = 'none';
        }, 500); // Aguarda 500ms para ocultar a div
    }, tempoExibicao);
}
function removerProdutos() {
    var abaCarrinho = document.getElementById('abaCarrinho');
    var produtosCarrinho = abaCarrinho.getElementsByClassName('esseProduto');
    var produtosArray = Array.from(produtosCarrinho);
    for (var i = produtosArray.length - 1; i >= 0; i--) {
        var produto = produtosArray[i];
        abaCarrinho.removeChild(produto);
    }
    atualizarValorTotal();
    fetch('/api/remover-produtos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailUsuario }),
    })
        .then((response) => response.json())
        .then((data) => {
        })
        .catch((error) => {
            console.error('Erro:', error);
        });
}