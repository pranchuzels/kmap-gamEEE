from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import UserSerializer
from . import kmap_solver

class CheckUser(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

    def post(self, request):
        
        username = request.data.get('username')
        if not username:
            return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)

        # if User.objects.filter(username=username).exists():
        #     user = User.objects.get(username = username)
        #     serializer = UserSerializer(user)
        #     return Response(serializer.data, status=status.HTTP_200_OK)
        # else:
        #     difficulty = 1
        #     score = 0
        #     num_var, form, terms, dont_cares, groupings = kmap_solver.randomizeQuestion(difficulty=difficulty)
        #     user = User(username=username, score=score, difficulty=difficulty, q_num_var=num_var, q_form=form, q_terms=terms, q_dont_cares=dont_cares, q_groupings=groupings)
        #     serializer = UserSerializer(user)
        #     user.save()
        #     return Response(serializer.data, status=status.HTTP_200_OK)

        difficulty = 1
        score = 0
        num_var, form, terms, dont_cares, groupings = kmap_solver.randomizeQuestion(difficulty=difficulty)
        user = User(username=username, score=score, difficulty=difficulty, q_num_var=num_var, q_form=form, q_terms=terms, q_dont_cares=dont_cares, q_groupings=groupings)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
class CheckAnswer(APIView):
    # def get(self, request):
        
    def post(self, request):
        if request.data.get('type') == 0:
            username = request.data.get('user').get('username')
            score = request.data.get('user').get('score')
            difficulty = request.data.get('user').get('difficulty')
            num_var = request.data.get('user').get('q_num_var')
            form = request.data.get('user').get('q_form')
            terms = request.data.get('user').get('q_terms')
            dont_cares = request.data.get('user').get('q_dont_cares')
            groupings = request.data.get('user').get('q_groupings')
            answer = request.data.get('user').get('answer')
            result, answers = kmap_solver.minimizeAndCheck(
                num_var = num_var, 
                form_terms = form, 
                terms = terms, 
                dont_cares = dont_cares, 
                input_answer=answer)
            return Response({'result': result, 'answers': answers}, status=status.HTTP_200_OK)
    
        else:
            username = request.data.get('user').get('username')
            score = request.data.get('user').get('score')
            difficulty = request.data.get('user').get('difficulty')
            result = request.data.get('user').get('result')
            if result == 1:
                score += 1
                if score >= 5 and difficulty == 1:
                    difficulty = 2
                if score >= 10 and difficulty == 2:
                    difficulty = 3
            else:
                score = 0
                difficulty = 1
            num_var, form, terms, dont_cares, groupings = kmap_solver.randomizeQuestion(difficulty=difficulty)
            user = User(username=username, score=score, difficulty=difficulty, q_num_var=num_var, q_form=form, q_terms=terms, q_dont_cares=dont_cares, q_groupings=groupings)
            serializer = UserSerializer(user)
            return Response({'result': result, 'user': serializer.data}, status=status.HTTP_200_OK)


        # username = request.data.get('username')
        # answer = request.data.get('answer')
        # if not username:
        #     return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)
        # if not answer:
        #     return Response({'error': 'Answer is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # user = User.objects.get(username=username)
        # result = kmap_solver.minimizeAndCheck(num_var = user.q_num_var, form_terms = user.q_form, terms = user.q_terms, dont_cares =  user.q_dont_cares, input_answer=answer)
        # if result == 1:
        #     user.score += 1
        #     if user.score >= 5 and user.difficulty == 1:
        #         user.difficulty = 2
        #     if user.score >= 10 and user.difficulty == 2:
        #         user.difficulty = 3
        #     user.q_num_var, user.q_form, user.q_terms, user.q_dont_cares, user.q_groupings = kmap_solver.randomizeQuestion(difficulty=user.difficulty)
        #     user.save()
        #     serializer = UserSerializer(user)
        #     return Response({'result': result, 'user': serializer.data}, status=status.HTTP_200_OK)
        # else:
        #     serializer = UserSerializer(user)
        #     return Response({'result': result, 'user': serializer.data}, status=status.HTTP_200_OK)
