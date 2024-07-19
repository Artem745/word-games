from django.db import models
from users.models import User


class Category(models.Model):
    name = models.CharField(max_length=255)
    image = models.ImageField(upload_to="category_image", blank=True, null=True)
    author = models.ForeignKey(blank=True, null=True, to=User, on_delete=models.CASCADE)

    class Meta:
        db_table = "category"
        verbose_name = "category"
        verbose_name_plural = "categories"
        unique_together = ('name', 'author')

    def __str__(self):
        return self.name

class Word(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(blank=True, null=True, to=Category, on_delete=models.CASCADE, related_name="word")
    length = models.PositiveIntegerField(default=0)
    author = models.ForeignKey(blank=True, null=True, to=User, on_delete=models.CASCADE)

    class Meta:
        db_table = "word"
        verbose_name = "word"
        verbose_name_plural = "words"
        unique_together = ('name', 'category', 'author')

    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.category or not self.author:
            self.length = len(self.name)
        super(Word, self).save(*args, **kwargs)
