from django.shortcuts import render
from creating_categories.templatetags.word_id_filters import decrypt_id
from hangman.models import Word
from django.template.loader import render_to_string
from django.http import JsonResponse
from django.views.decorators.http import require_POST
import random
import enchant
import json


# main Wordle - це сторінка на якій обираємо категорію для гри Wordle
def index(request, encrypted_id=None):
    
    if request.method == 'GET': # це коли ми нажали на кнопку за категорією 
        length = request.GET.get('length', None) 
        if length is not None:
            length = int(length)
            words = Word.objects.filter(length=length, author=None)
            if words.exists():
                real_word = random.choice(words)
                update_html = render_to_string('wordle/wordle_partial.html', {'word': real_word.name.lower()})
                request.session['real_word'] = real_word.name  # Зберігаємо real_word у сесії
                return JsonResponse({'status': 'success', 'update_html': update_html, 'real_word': real_word.name.lower()})
        
        elif request.GET.get('encrypted_id', None):
            real_word = Word.objects.get(id=decrypt_id(request.GET.get('encrypted_id')))
            update_html = render_to_string('wordle/wordle_partial.html', {'word': real_word.name.lower()})
            request.session['real_word'] = real_word.name  # Зберігаємо real_word у сесії
            return JsonResponse({'status': 'success', 'update_html': update_html, 'real_word': real_word.name.lower()})
 
    
    context = { # це просто коли ми ще не вибрали категорію "просто сторінка"
        "title": "Wordle",
        "encrypted_id": encrypted_id
    }
    return render(request, "wordle/wordle.html", context)

@require_POST # сама жопа, тут вся логіка гри wordle перевірки слов на їх правільність у def check_word_exists(word) і встановлення відповідного кольору для літер
def check_word_view(request):
    user_answer = request.POST.get('user_answer') # from js we get USER_ANSWER (те що написав юзер)
    real_word = request.POST.get('real_word') 
    use_letter = []
    if user_answer != "":
        user_answer = user_answer.lower() # якщо юзер еблан і написав слово з капсом (hElLo) - (hello)
        # real_word = real_word.lower() # якщо я еблан і написав слово з капсом (hElLo) - (hello)

        if check_word_exists(user_answer, real_word):
            if len(user_answer) == len(real_word): 
                is_correct = user_answer == real_word
                letter_status = ['absent'] * len(real_word)
                real_word_count = {}

                # Підраховуємо кількість кожної літери в real_word
                for letter in real_word:
                    if letter in real_word_count:
                        real_word_count[letter] += 1
                    else:
                        real_word_count[letter] = 1

                # Спочатку перевіряємо правильні літери на правильних місцях
                for i, letter in enumerate(user_answer):
                    if letter == real_word[i]:
                        letter_status[i] = 'correct'
                        real_word_count[letter] -= 1
                        use_letter.append(letter)

                # Потім перевіряємо правильні літери на неправильних місцях
                for i, letter in enumerate(user_answer):
                    if letter != real_word[i] and letter in real_word and real_word_count[letter] > 0:
                        letter_status[i] = 'present'
                        real_word_count[letter] -= 1


                return JsonResponse({'status': 'success', 'is_correct': is_correct, 'letter_status': letter_status, 'use_status' : use_letter})
            else:
                return JsonResponse({'status': 'short', 'is_correct': False})
        else:
            return JsonResponse({'status': 'unexist', 'is_correct': False})
    else:
        return JsonResponse({'status': 'short', 'is_correct': False})

def check_word_exists(word, real_word):
    if word == real_word:
        return True
    check = enchant.Dict("en_US")
    return check.check(word)

def wordle_hint(request):
    if request.method == 'POST':
        used_letters_json = request.POST.get('hint_letter')  # Отримуємо JSON-рядок зі списком використаних літер
        used_letters = json.loads(used_letters_json)  # Розбираємо JSON-рядок у список
        print(used_letters)  # Друкуємо список використаних літер для перевірки
        
        real_word = request.POST.get('real_word') 
        available_letters = [letter for letter in real_word if letter not in used_letters]
        
        if available_letters:
            hint = random.choice(available_letters)  # Вибір випадкової літери зі списку доступних
            used_letters.append(hint)
            return JsonResponse({'status': 'success', 'hint': hint, 'used_letters': used_letters})
        else:
            return JsonResponse({'status': 'error', 'message': 'No hint available.'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method.'})

        
def wordle_status(request):
    if request.GET.get('status') == "win":
        update_html = render_to_string("wordle/wordle_partial2.html", {"status": "win"})

    if request.GET.get('status') == "lose":
        real_word = request.session.get('real_word')  # Отримуємо real_word з сесії
        update_html = render_to_string("wordle/wordle_partial2.html", {"status": "lose", "word": real_word})
        
    if request.GET.get('status') == "unexist":
        update_html = render_to_string("wordle/wordle_partial3.html", {"status": "unexist"})
        
    if request.GET.get('status') == "short":
        update_html = render_to_string("wordle/wordle_partial3.html", {"status": "short"})
        
    return JsonResponse({'status': 'success', 'update_html': update_html})
    
    