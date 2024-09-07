from django.shortcuts import render, get_object_or_404

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.renderers import JSONRenderer
from rest_framework import status

from .models import Product
from .serializers import ProductSerializer

@api_view(['GET'])
def api_root(request):
    routes={
        'products':request.build_absolute_uri('products/'),
        'product_detail':request.build_absolute_uri('products/{id}/'),
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