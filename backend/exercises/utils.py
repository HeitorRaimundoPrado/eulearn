import math
from decimal import Decimal
from django.core.cache import cache
from .models import QuestionVotes, Question
from django.db.models import F, Count, Max, Value, Q
from django.db.models.functions import Coalesce

def calculate_pq(question_id):
    question = Question.objects.only('answers', 'explanation').get(pk=question_id)

    correct_answers = cache.get(f'correct_answers_{question_id}', 0)
    incorrect_answers = cache.get(f'incorrect_answers_{question_id}', 0)

    CIMax = cache.get("ci_max", 1)

    CIq = incorrect_answers / max(correct_answers, 1)
    if CIq > CIMax:
        CIMax = CIq
        cache.set('ci_max', CIq)

    NVMax = QuestionVotes.objects.values('question').annotate(
        positive_count=Count('id', filter=Q(positive=True)),
        negative_count=Count('id', filter=Q(positive=False))
    ).annotate(
        ratio=Coalesce(F('positive_count'), Value(1)) / Coalesce(F('negative_count'), Value(1))
    ).aggregate(Max('ratio'))['ratio__max'] or 1

    votes_for_question = QuestionVotes.objects.filter(question=question)
    positive_votes_q = votes_for_question.filter(positive=True).count()
    negative_votes_q = votes_for_question.filter(positive=False).count()

    NVq = positive_votes_q / max(negative_votes_q, 1)

    return max(100 * math.sqrt(NVq) / math.sqrt(NVMax) * math.sqrt(CIq) / math.sqrt(CIMax), 10)
    

def calculate_rd(Pu, Pq):
    PUmax = cache.get('pu_max', 1000)
    if Pu > PUmax:
        PUmax = Pu
        cache.set('pu_max', Pu)

    return Decimal(Pq) * (Decimal(1) - Decimal(Pu) / Decimal(PUmax) * Decimal(0.95) + Decimal(1))
