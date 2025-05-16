import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import para ngModel
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],  // importante importar FormsModule para ngModel funcionar
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  resumo = { totalItens: 0, totalValor: 0 };
  produtos: Product[] = [];
  produtosFiltrados: Product[] = [];
  filtro: string = '';

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.productService.seedData();
    this.atualizarDados();
  }

  atualizarDados() {
    this.resumo = this.productService.getResumo();
    this.produtos = this.productService.getAll();
    this.produtosFiltrados = [...this.produtos];  // copia inicial
  }

  filtrarProdutos() {
    const filtroLower = this.filtro.toLowerCase();
    this.produtosFiltrados = this.produtos.filter(p =>
      p.name.toLowerCase().includes(filtroLower)
    );
  }

  excluirProduto(id: number) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.productService.delete(id);
      this.atualizarDados();
      this.filtrarProdutos(); // atualiza filtro após exclusão
       this.exibirMensagem('Produto excluído com sucesso!');
    }
  }

  editarProduto(produto: Product) {
      this.router.navigate(['/editar-produto', produto.id]);
  }

  abrirCriarProduto() {
    this.router.navigate(['/novo-produto']);
  }

  mensagemFlutuante: string = '';
mostrarMensagem = false;

exibirMensagem(texto: string, duracaoMs: number = 2500) {
  this.mensagemFlutuante = texto;
  this.mostrarMensagem = true;

  setTimeout(() => {
    this.mostrarMensagem = false;
  }, duracaoMs);
}

// Variáveis para controlar o diálogo de confirmação
idProdutoParaExcluir: number | null = null;
mostrarConfirmacaoExcluir = false;

exibirConfirmacaoExcluir(id: number) {
  this.idProdutoParaExcluir = id;
  this.mostrarConfirmacaoExcluir = true;
}

cancelarExclusao() {
  this.idProdutoParaExcluir = null;
  this.mostrarConfirmacaoExcluir = false;
}

confirmarExclusao() {
  if (this.idProdutoParaExcluir !== null) {
    this.productService.delete(this.idProdutoParaExcluir);
    this.atualizarDados();
    this.filtrarProdutos();
    this.exibirMensagem('Produto excluído com sucesso!');
  }
  this.cancelarExclusao();
}

}