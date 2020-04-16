import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(products: any, input: string): any {
    if (input.length === 0 || input === '') {
      return;
    }
    let filteredProducts = [];
    filteredProducts= products.filter(
      p => p.product_name.toLowerCase().includes(input.toLowerCase()))    
    return filteredProducts;    
  }
}
