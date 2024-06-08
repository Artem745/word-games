from django.contrib import admin
from hangman.models import Category, Word

# Register your models here.
admin.site.register(Category)

@admin.register(Word)
class WordAdmin(admin.ModelAdmin):
    list_display = ('name', 'category')
    list_filter = ('category',)