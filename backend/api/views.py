from django.shortcuts import render, get_object_or_404

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import JSONRenderer
from rest_framework import status

from .models import Product, Cart, CartItem
from .serializers import ProductSerializer, CartItemSerializer

@api_view(['GET'])
def api_root(request):
    routes={
        'products':request.build_absolute_uri('products/'),
        'product_detail':request.build_absolute_uri('products/1/'),
    }
    return Response(routes)

@api_view(['GET','POST'])
def product_list(request):
    if request.method=="GET":
        products=Product.objects.all()
        serializer=ProductSerializer(products,many=True)
        return Response(serializer.data)
    elif request.method=="POST":
        serializer=ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET','PUT','PATCH','DELETE'])
def product_detail(request,pk):
    product=get_object_or_404(Product,pk=pk)
    if request.method=="GET":
        serializer=ProductSerializer(product)
        return Response(serializer.data)
    elif request.method in ["PUT",'PATCH']:
        serializer=ProductSerializer(product,data=request.data,partial=request.method=="PATCH")
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    elif request.method=="DELETE":
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

@permission_classes([IsAuthenticated])
@api_view(['POST'])
def add_to_cart(request):
    product_id=request.data.get('product_id')
    quantity=request.data.get('quantity',1)
    if not product_id:
        return Response({'error':'Product ID is required'},status=status.HTTP_400_BAD_REQUEST)
    try:
        product=Product.objects.get(pk=product_id)
    except Product.DoesNotExist:
        return Response({'error':'Product not found'},status=status.HTTP_404_NOT_FOUND)
    cart,created=Cart.objects.get_or_create(user=request.user)
    cart_item,item_created=CartItem.objects.get_or_create(cart=cart,product=product)
    
    if not item_created:
        cart_item.quantity += int(quantity)
    else:
        cart_item.quantity=int(quantity)
    cart_item.save()
    serializer=CartItemSerializer(cart_item)
    return Response(serializer.data,status=status.HTTP_201_CREATED)