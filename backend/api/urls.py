from django.urls import path
from . import views

urlpatterns = [
    path('', views.api_root, name='api-root'),
    path('products/', views.product_list, name='product-list'),
    path('products/<str:pk>/', views.product_detail, name='product-detail'),
]