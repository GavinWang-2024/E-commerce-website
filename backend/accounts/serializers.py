from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

class UserSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True)
    class Meta:
        model=User
        fields=['id','username','email','first_name','last_name','password']
    def create(self,validated_data):
        user=User.objects.create_user(**validated_data)
        return user

class TokenSerializer(serializers.Serializer):
    refresh=serializers.CharField()
    access=serializers.CharField()

class LoginSerializer(serializers.Serializer):
    username=serializers.CharField()
    password=serializers.CharField(write_only=True)