from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager, AbstractBaseUser, PermissionsMixin
from django.utils import timezone

# Юзаем готовый джанго класс (username главный)
# class User(AbstractUser):

#     class Meta:
#         db_table = "user"
        
#     def __str__(self):
#         return self.username
    

# Хуярим вручную (email главный)
class CustomUserManager(UserManager):
    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('Provide valid email')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user
    
    def create_user(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self._create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(blank=True, null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        db_table = "user"
        verbose_name = "user"
        verbose_name_plural = "user"
        
    def get_full_name(self):
        return self.email
    
    def get_short_name(self):
        return self.email.split('@')[0]
    
