import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto, CartResponseDto } from './dto/cart.dto';

@ApiTags('Cart')
@ApiBearerAuth('JWT-auth')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  @ApiResponse({ status: 200, description: 'User cart details', type: CartResponseDto })
  async getCart() {
    // Temporarily use a mock user ID for testing
    return this.cartService.getUserCart(1);
  }

  @Post('add')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 201, description: 'Item added to cart successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async addToCart(@Body() addToCartDto: AddToCartDto) {
    // Temporarily use a mock user ID for testing
    return this.cartService.addToCart(1, addToCartDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiParam({ name: 'id', description: 'Cart item ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Cart item updated successfully' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  async updateCartItem(
    @Param('id') id: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    // Temporarily use a mock user ID for testing
    return this.cartService.updateCartItem(1, id, updateCartItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiParam({ name: 'id', description: 'Cart item ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Item removed from cart successfully' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  async removeFromCart(@Param('id') id: number) {
    // Temporarily use a mock user ID for testing
    return this.cartService.removeFromCart(1, id);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Clear user cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
  async clearCart() {
    // Temporarily use a mock user ID for testing
    return this.cartService.clearCart(1);
  }
} 