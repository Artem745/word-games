from django.shortcuts import render
from django.http import JsonResponse
from django.template.loader import render_to_string


def index(request):
    
    if request.method == 'GET': # це коли ми нажали на кнопку за категорією 
        name = request.GET.get('name', None) 
        if name is not None:
            update_html = render_to_string('words/words_partial.html')
            return JsonResponse({'status': 'success', 'update_html': update_html})
 
    context ={
        "title": "Words"
    }

    return render(request, 'words/words.html', context)