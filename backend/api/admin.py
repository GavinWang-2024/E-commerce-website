from django.contrib import admin
from .models import Product, CartItem, Cart
# Register your models here.
admin.site.register(Product)
admin.site.register(CartItem)
admin.site.register(Cart)