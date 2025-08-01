import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}

  async getUserCart(userId: number) {
    const cartItems = await this.cartRepository.find({
      where: { user: { id: userId } },
      relations: ['product_variant', 'product_variant.product'],
    });

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => {
      return sum + (item.product_variant.price * item.quantity);
    }, 0);

    return {
      items: cartItems,
      total_items: totalItems,
      total_price: totalPrice,
    };
  }

  async addToCart(userId: number, addToCartDto: AddToCartDto) {
    const existingItem = await this.cartRepository.findOne({
      where: {
        user: { id: userId },
        product_variant: { id: addToCartDto.product_variant_id },
      },
    });

    if (existingItem) {
      existingItem.quantity += addToCartDto.quantity;
      return this.cartRepository.save(existingItem);
    }

    const cartItem = this.cartRepository.create({
      user: { id: userId },
      product_variant: { id: addToCartDto.product_variant_id },
      quantity: addToCartDto.quantity,
    });

    return this.cartRepository.save(cartItem);
  }

  async updateCartItem(userId: number, itemId: number, updateCartItemDto: UpdateCartItemDto) {
    const cartItem = await this.cartRepository.findOne({
      where: { id: itemId, user: { id: userId } },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    cartItem.quantity = updateCartItemDto.quantity;
    return this.cartRepository.save(cartItem);
  }

  async removeFromCart(userId: number, itemId: number) {
    const cartItem = await this.cartRepository.findOne({
      where: { id: itemId, user: { id: userId } },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartRepository.remove(cartItem);
    return { message: 'Item removed from cart successfully' };
  }

  async clearCart(userId: number) {
    await this.cartRepository.delete({ user: { id: userId } });
    return { message: 'Cart cleared successfully' };
  }
} 