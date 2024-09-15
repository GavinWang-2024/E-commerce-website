from rest_framework.serializers import ModelSerializer
from .models import Product, CartItem

class ProductSerializer(ModelSerializer):
    class Meta:
        model=Product
        fields='__all__'

class CartItemSerializer(ModelSerializer):
    class Meta:
        model=CartItem
        fields=['id','product','quantity']