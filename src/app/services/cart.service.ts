import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Pizza } from '../models/pizza'
 
export interface Product {
  id: number;
  name: string;
  price: number;
  amount: number;
}
@Injectable({
  providedIn: 'root'
})
export class CartService {

  results: string;
  private readonly url = "https://api.ynov.jcatania.io/pizza";
 
  private cart = [];
  private cartItemCount = new BehaviorSubject(0);
 
  constructor(private http: HttpClient) {}

  sayHello(id: number){
    console.log("sayHello('" + id + "')");
}

get()
{
    let rt: Array<Pizza> = new Array<Pizza>();
    return new Promise<Array<Pizza>>(
        resolve => {
            this.http.get(this.url).subscribe((data:Array<any>) => {
                for(let i=0; i < data.length; i++){
                    rt.push(new Pizza(data[i]['id'], data[i]['nom'], data[i]['photo'], data[i]['prix'], data[i]['ingredients']))
                }
                resolve(rt);});
        });
}

getById(id: Number)
{
    let rt: Pizza = new Pizza();
    return new Promise<Pizza>(
        resolve => {
            this.http.get(this.url + "/" + id).subscribe((data:any) => {
                let rt = new Pizza(data['id'], data['nom'], data['photo'], data['prix'], data['ingredients']);
                resolve(rt);
            });
        });
}

post(pizza: Pizza){
    return new Promise<Pizza>(
        resolve => {
            this.http.post(this.url, pizza).subscribe((data:any) => {
                let rt = new Pizza(data['nom'], data['photo'], data['prix'], data['ingredients']);
                resolve(rt);
            });
        });
}

delete(id: number){
    let rt: Pizza = new Pizza();
    return new Promise<Pizza>(
        resolve => {
            this.http.delete(this.url +"/"+ id).subscribe((data:any) => {
                let rt = new Pizza(data['id'], data['nom'], data['photo'], data['prix'], data['ingredients']);
                resolve(rt);
            });
        });

}

update(pizza: Pizza, pizzaId: number){
    return new Promise<Pizza>(
        resolve => {
            this.http.put(this.url + "/" + pizzaId, pizza).subscribe((data:any) => {
                let rt = new Pizza(data['nom'], data['photo'], data['prix'], data['ingredients']);
                resolve(rt);
            });
        });
}
   
  getCart() {
    return this.cart;
  }
 
  getCartItemCount() {
    return this.cartItemCount;
  }
 
  addProduct(product) {
    let added = false;
    for (let pizza of this.cart) {
      if (pizza.id === product.id) {
        pizza.amount += 1;
        added = true;
        break;
      }
    }
    if (!added) {
      this.cart.push(product);
    }
    this.cartItemCount.next(this.cartItemCount.value + 1);
  }
 
  decreaseProduct(product) {
    for (let [index, pizza] of this.cart.entries()) {
      if (pizza.id === product.id) {
        pizza.amount -= 1;
        if (pizza.amount == 0) {
          this.cart.splice(index, 1);
        }
      }
    }
    this.cartItemCount.next(this.cartItemCount.value - 1);
  }
 
  removeProduct(product) {
    for (let [index, pizza] of this.cart.entries()) {
      if (pizza.id === product.id) {
        this.cartItemCount.next(this.cartItemCount.value - pizza.amount);
        this.cart.splice(index, 1);
      }
    }
  }
}