import random
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.template.loader import render_to_string
from creating_categories.templatetags.word_id_filters import decrypt_id
from hangman.models import Category, Word


def index(request, encrypted_id=None):
    category = request.GET.get("category")
    categories = Category.objects.filter(author=None)
    hints = request.GET.get("hints")

    context = {
        "title": "Hangman",
        "categories": categories,
        "hints": hints if hints else 3,
        "encrypted_id": encrypted_id, # далі в html і js по ній буде понятно це дефолт гра чи з кастомними категоріями
        }

    if category:
        if category == "Random":
            category = random.choice(categories).name
            words = Word.objects.filter(category__name=category)

        if category == "Custom":
            encrypted_id = request.GET.get("encrypted_id")
            words = Word.objects.filter(category__id=decrypt_id(encrypted_id))

        else:
            words = Word.objects.filter(category__name=category)

        word = random.choice(words)
        alphabet = list("QWERTYUIOPASDFGHJKLZXCVBNM")

        if request.GET.get("category") == "Random":
            category = "Random"
            
        update_html = render_to_string("hangman/hangman_partial.html", {"word": word.name, "category": word.category.name if category == "Custom" else category, "alphabet": alphabet})
        return JsonResponse({'status': 'success', 'update_html': update_html})

    return render(request, "hangman/hangman.html", context)


def hangman(request):
    errors = request.GET.get("errors")
    if errors:
        update_html = render_to_string("hangman/hangman_partial2.html", {"errors": int(errors)})
        return JsonResponse({'status': 'success', 'update_html': update_html})

    if request.GET.get('status') == "over":
        update_html = render_to_string("hangman/hangman_partial3.html", {"status": "over"})
        
    if request.GET.get('status') == "win":
        update_html = render_to_string("hangman/hangman_partial3.html", {"status": "win"})

    return JsonResponse({'status': 'success', 'update_html': update_html})
