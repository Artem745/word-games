from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    image = models.ImageField(upload_to="category_image", blank=True, null=True)

    class Meta:
        db_table = "category"
        verbose_name = "category"
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name

class Word(models.Model):
    name = models.CharField(max_length=255, unique=True)
    category = models.ForeignKey(to=Category, on_delete=models.CASCADE)

    class Meta:
        db_table = "word"
        verbose_name = "word"
        verbose_name_plural = "words"
    
    def __str__(self):
        return self.name