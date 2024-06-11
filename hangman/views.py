import random
from django.http import JsonResponse
from django.shortcuts import render
from django.template.loader import render_to_string
from hangman.models import Category, Word

# Create your views here.
def index(request):
    category = request.GET.get("category")
    categories = Category.objects.all()

    if category:
        if category == "Random":
            category = random.choice(categories).name
        words = Word.objects.filter(category__name=category)
        word = random.choice(words)
        alphabet = list("QWERTYUIOPASDFGHJKLZXCVBNM")

        update_html = render_to_string("hangman/hangman_partial.html", {"word": word.name, "category": category, "alphabet": alphabet})
        return JsonResponse({'status': 'success', 'update_html': update_html})
    
    context = {
        "title": "Hangman",
        "categories": categories,
    }

    return render(request, "hangman/hangman.html", context)


def hangman(request):
    errors = request.GET.get("errors")
    if errors:
        update_html = render_to_string("hangman/hangman_partial2.html", {"errors": int(errors)})

    if request.GET.get('status') == "over":
        update_html = render_to_string("hangman/hangman_partial3.html", {"status": "over"})
        
    if request.GET.get('status') == "win":
        update_html = render_to_string("hangman/hangman_partial3.html", {"status": "win"})

    return JsonResponse({'status': 'success', 'update_html': update_html})
