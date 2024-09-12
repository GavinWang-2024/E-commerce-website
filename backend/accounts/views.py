from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.urls import reverse

from rest_framework import viewsets,status
from rest_framework.decorators import action,api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import UserSerializer,LoginSerializer

@api_view(['GET'])
def api_root(request):
    return Response({
        'users':reverse('user-list'),
        'register':reverse('user-register'),
        'login':reverse('login'),
    })

class UserViewSet(viewsets.ModelViewSet):
    queryset=User.objects.all()
    serializer_class=UserSerializer
    @action(detail=False,methods=['POST'])
    def register(self,request):
        serializer=self.get_serializer(data=request.data)
        if serializer.is_valid():
            user=serializer.save()
            return Response(UserSerializer(user).data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self,request):
        serializer=LoginSerializer(data=request.data)
        if serializer.is_valid():
            username=serializer.validated_data['username']
            password=serializer.validated_data['password']
            user=authenticate(username=username,password=password)
            if user:
                refresh=RefreshToken.for_user(user)
                return Response({
                    'refresh':str(refresh),
                    'access':str(refresh.access_token)
                })
            else:
                return Response({"error":"Invalid credentials"},status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)