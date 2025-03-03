# Boolean expression minimalization using Quine-McCluskey algorithm & Petrick's method
# https://en.wikipedia.org/wiki/Quine-McCluskey_algorithm
# https://en.wikipedia.org/wiki/Petrick%27s_method

# TODO:
#  - [DONE] Include answer checker
#  - Create randomizer for easy, medium, and hard questions
#  - [DONE] Change minimizePrimeImplicants result to list of list of set for literals, just make a separate print function for readability
#  - check randomizer if its all 1's or 0's 
#  - [DONE?] add checks for inputs in checkAnswer

import copy, random, numpy.random as npr

def randomizeQuestion(difficulty: int) -> tuple[int, str, list[int], list[int]]:
    """
    Generates a random question by giving a list of minterms/maxterms and don't cares.

    :param difficulty: Difficulty of question to be generated. Possible values: 1 = easy, 2 = medium, 3 = hard, 4 = random.
    :type difficulty: int

    :rtype: tuple[ num_var, form, terms, dont_cares ]
    :returns: `randomizeQuestion()` returns a tuple of the following arguments needed for `getPrimeImplicants()` and `minimizePrimeImplicants()`.
    
    :returns num_var: `int`, number of variables in boolean expression
    :returns form: `"min"` or `"max"`, determines if the given terms are minterms or maxterms. Defaults to `"min"`.
    :returns terms: `list[int]`, list of given min/maxterms as integers
    :returns dont_cares: `list[int]`, list of don't cares. Defaults to an empty list.
    
    """
    terms = []
    dont_cares = []
    if difficulty == 1:
        # For easy difficulty:
        # - Expressions only up to 3 terms
        # - Equal possibility of 2, 3, 4 vars
        # - No don't cares
        # - Either biggest groups or smallest (?)
        # - no multiple answers
        # - SOP only
        num_terms = random.randint(1, 3)
        num_var = random.randint(2, 4)
        terms_groupsizes = [random.randint(0, num_var-1) for _ in range(num_terms)]
        terms = [set() for _ in range(num_terms)]
    #     for i in range(len(terms)):

    #     return
    elif difficulty == 2:
    #     # For medium difficulty:
    #     # - Can have don't cares
    #     # - Expressions can have up to 5 terms
    #     # - All groups possible
    #     # - Can multiple answers
    #     # - Only 3 or 4 vars
        return
    elif difficulty == 3:
    #     # For hard difficulty:
    #     # - Can have don't cares
    #     # - as much terms as possible
    #     # - All groups possible
    #     # - Can multiple answers
    #     # - 4 vars only
        return
    elif difficulty == 4:
        num_var = random.randint(4, 6)
        terms = sorted(npr.choice(range(2**num_var), size=random.randint(int((2**num_var)/8), int((2**num_var)/2)), replace=False).tolist())
        num_dc = random.randint(0, 3)
        if num_dc != 0:
            dont_cares = sorted(npr.choice(terms, size=min(num_dc, len(terms)-1), replace=False).tolist())
            for dc in dont_cares:
                terms.remove(dc)
        form = random.choice(["min", "max"])

    return num_var, form, terms, dont_cares



def getPrimeImplicants(num_var: int, 
                       terms: list[int], 
                       dont_cares: list[int] = [],  
                       form_terms: str = "min",
                       ) -> list[str]:
    """
    Accepts a list of minterms or maxterms (as integers) and returns a list of prime implicants.

    :param num_var: Number of variables in boolean expression
    :type num_var: int
    :param terms: List of given min/maxterms as integers
    :type terms: list[int]
    :param dont_cares: List of don't cares. Defaults to an empty list.
    :type dont_cares: list[int], optional
    :param form_terms: `"min"` or `"max"`, determines if the given terms are minterms or maxterms. Defaults to `"min"`.
    :type form_terms: str, optional


    :return prime_implicants: List of binary strings of prime implicants with don't care digits as '-'.
    """
    prime_implicants = []
    merged_terms = [[] for _ in range(num_var + 1)] # Running group for number of 1's/0's in terms

    # Start to group terms with how many 1's/0's they have
    for term in list(map(lambda t: bin(t).lstrip("0b").rjust(num_var, "0"), terms + dont_cares)): # Convert to binary strings
        if form_terms.lower() == "min":
            count = term.count("1")
        elif form_terms.lower() == "max":
            count = term.count("0")
        merged_terms[count].append(term)

    merged_terms = list(filter(lambda b: b, merged_terms)) # Remove groups with no terms

    # print("Current merged minterms:", merged_terms)


    while True:
        merged_terms_cache = [] # Cache to avoid adding duplicate unmatched terms, especially for largest group of terms
        new_merged_terms = [[] for _ in range(num_var + 1)]

        for j in range(len(merged_terms)-1): # Loop for every term group except last one
            for term1 in merged_terms[j]: # Loop for every term in current term group
                noMatches = True 
                for term2 in merged_terms[j+1]: # Check every term of next term group
                    
                    diff = -1 # index of only different digit
                    for d in range(len(term1)): # Check every digit of two terms
                        if term1[d] != term2[d] and diff == -1:
                            diff = d
                        elif term1[d] == term2[d]:
                            continue
                        else:
                            break # Stop if there's another difference
                    else: #
                        noMatches = False

                        # Save to cache for prime implicant saving
                        if term1 not in merged_terms_cache:
                            merged_terms_cache.append(term1)
                        if term2 not in merged_terms_cache:
                            merged_terms_cache.append(term2)

                        new_term = list(term1)
                        new_term[diff] = "-"
                        new_term = "".join(new_term)
                        if new_term not in new_merged_terms[j]: # Avoid repeating terms
                            new_merged_terms[j].append(new_term)

                if noMatches:
                    if term1 not in merged_terms_cache:
                        prime_implicants.append(term1)

        # Check last group of terms
        for mt in merged_terms[-1]:
            if mt not in merged_terms_cache:
                    prime_implicants.append(mt)

        if new_merged_terms == [[] for _ in range(num_var + 1)]: # If no new terms were merged
            # Add all remaining terms if not in current prime implicant list and finish loop
            for group in merged_terms:
                for mt in group:
                    if mt not in prime_implicants:
                        prime_implicants.append(mt)
            break 

        else: # If there are new minterms, repeat loop
            merged_terms = new_merged_terms
            merged_terms = list(filter(lambda b: b, merged_terms)) # Remove groups with no terms

    return prime_implicants



def minimizePrimeImplicants(num_var: int, 
                                terms: list, 
                                prime_implicants: list[str],
                                form_terms: str = "min"
                                ) -> list[list[set[str]]]:
    """
    Returns a list of all possible minimal expressions given a list of terms and prime implicants.
    The form of the minimal expression is dependent on the form of the given terms, i.e. minterms 
    produce a minimal SOP expression while maxterms produce a minimal POS expression.

    :param num_var: Number of variables in boolean expression
    :type num_var: int
    :param terms: List of given min/maxterms as integers
    :type terms: list[int]
    :param prime_implicants: List of prime implicants as strings of binary and '-' as don't cares.
    :type prime_implicants: list[str]
    :param form_terms: `"min"` or `"max"`, determines if the given terms are minterms or maxterms. Defaults to `"min"`.
    :type form_terms: str, optional

    :rtype: list[ list[ set[ str ] ] ]
    :returns: List of all possible minimal expressions. Each expression is a list of terms, 
    which are represented as a set of strings.
    """

    prime_implicant_chart: dict = {}
    terms = list(map(lambda mt: bin(mt).lstrip("0b").rjust(num_var, "0"), terms)) # Convert to strings of binary
    for pi in prime_implicants: # Add keys with empty string values in chart for every prime implicant
        prime_implicant_chart[pi] = ""

    # Fill up prime implicant chart
    for pi in prime_implicant_chart.keys(): # For every prime implicant...
        for term in terms: # ... check if they cover any term in list of terms
            for answer in range(len(pi)):
                if pi[answer] == term[answer] or pi[answer] == "-":
                    continue
                else:
                    prime_implicant_chart[pi] += "0"
                    break # Stop if prime implicant does not cover term
            else:
                prime_implicant_chart[pi] += "1"


    # Start of chart simplification (at this point, currently SOP of prime implicant literals?)
    curr_min_exp = [[] for _ in range(len(terms))]
    
    # Write initial expression
    for i in range(len(terms)):
        for pi in prime_implicant_chart.keys():
            if prime_implicant_chart[pi][i] == "1":
                curr_min_exp[i].append(prime_implicants.index(pi))


    # Minimize absorbing literals, e.g. (A)(A+B) = (A), (A+B)(A+B+C) = (A+B), ...
    temp_min_exp = copy.deepcopy(curr_min_exp)
    for curr_answer in curr_min_exp:
        for other_group in curr_min_exp:
            if curr_answer == other_group:
                continue
            elif all(literal in other_group for literal in curr_answer) and other_group in temp_min_exp:
                temp_min_exp.remove(other_group)
    curr_min_exp = temp_min_exp
                    
    # Minimize distributive groups with the same number of literals
    # Example: (A+B) (B+C) = (B + AC), (A+B+C)(A+B+D) = (A + B + CD),...
    # For now, this code block only processes groups with only 1 different literalm check if need to check for more
    while True:
        temp_min_exp = copy.deepcopy(curr_min_exp)
        for curr_answer in curr_min_exp:
            if len(curr_answer) < 2:
                continue
            for other_group in curr_min_exp:
                if curr_answer == other_group:
                    continue
                else:
                    curr_in_other = [literal in other_group for literal in curr_answer] # list of boolean if elements in curr_group are missing in other
                    other_in_curr = [literal in curr_answer for literal in other_group] # list of boolean if elements in other_group are missing in curr
                    if curr_in_other.count(False) == 1 and other_in_curr.count(False) == 1:
                        if curr_answer in temp_min_exp and other_group in temp_min_exp:
                            temp_min_exp.remove(curr_answer)
                            temp_min_exp.remove(other_group)
                            # Get all literals existing in both groups
                            new_literal = list(filter(lambda literal: curr_in_other[curr_answer.index(literal)], curr_answer))
                            # Get all literals that are different in both groups
                            curr_missing = list(filter(lambda literal: not curr_in_other[curr_answer.index(literal)], curr_answer))
                            other_missing = list(filter(lambda literal: not other_in_curr[other_group.index(literal)], other_group))
                            new_literal.append(tuple(curr_missing + other_missing))
                            temp_min_exp.append(new_literal)

        if curr_min_exp == temp_min_exp: # If no simplification was done
            break
        else:
            curr_min_exp = temp_min_exp


    # Multiply all POS to form SOPs
    new_min_exp = []
    while len(curr_min_exp) > 0:
        curr_group = []
        for group in curr_min_exp.pop(0):
            if type(group) is tuple:
                curr_group.append(''.join(str(val) for val in group))
            else:
                curr_group.append(group)

        if len(new_min_exp) == 0:
            if len(curr_min_exp) == 0:
                new_min_exp.append(curr_group)
            else:
                new_min_exp = curr_group
            continue 
        else:
            temp_minbool = []
            for el1 in new_min_exp:
                for el2 in curr_group:
                    temp_minbool.append(str(el1) + str(el2))
            new_min_exp = temp_minbool

    # Convert to sets to remove repeating literals, e.g. AAB = AB
    for i in range(len(new_min_exp)):
        new_min_exp[i] = sorted(list(set(list(new_min_exp[i]))))
    new_min_exp.sort(key=lambda x: len(x))

    # Remove all absorbing literals but in SOP form
    while True:
        temp_min_exp = copy.deepcopy(new_min_exp)
        for i in range(len(new_min_exp)):
            for j in range(i, len(new_min_exp)):
                curr_answer = new_min_exp[i]
                other_group = new_min_exp[j]
                if curr_answer == other_group:
                    continue
                elif len(other_group) > len(curr_answer) and [literal in other_group for literal in curr_answer].count(False) >= 1 and other_group in temp_min_exp:
                    temp_min_exp.remove(other_group)

        if new_min_exp == temp_min_exp:
            break
        else:
            new_min_exp = temp_min_exp

    # Get the smallest length groups
    min_length = min(len(x) for x in new_min_exp)
    minimal_expressions = list(filter(lambda x: len(x) == min_length, new_min_exp))

    # Get final expression from literals
    final_expressions = []
    terms = [chr(65+x) for x in range(num_var)]
    for answer in minimal_expressions:
        curr_answer = []
        for group in answer:
            curr_group = set()
            for f in range(len(prime_implicants[int(group)])):
                if prime_implicants[int(group)][f] == "-":
                    continue
                elif prime_implicants[int(group)][f] == "1":
                    curr_group.add(str(terms[f]) if form_terms == "min" else str(terms[f]) + "'")
                elif prime_implicants[int(group)][f] == "0":
                    curr_group.add(str(terms[f]) + "'" if form_terms == "min" else str(terms[f]))
            curr_answer.append(curr_group)
        final_expressions.append(curr_answer)

    return final_expressions



def checkAnswer(minimal_expressions: list[list[set[str]]], input_answer: str, form_answer: str = "min") -> int:
    """
    Checks a given answer against the minimal expression given by `minimizePrimeImplicants()`.

    :param minimal_expressions: List of all possible minimal expressions. Each expression is a list of terms, 
    which are represented as a set of strings.
    :type minimal_expressions: list[list[set[str]]]
    :param input_answer: Given answer in string. Must only contain the following characters: ABCD\'()+ and space.
    :type input_answer: str
    :param form_terms: `"min"` or `"max"`, determines if the given terms are minterms or maxterms. Defaults to `"min"`.
    :type form_terms: str, optional

    :rtype result: int
    :returns:  Results in the following integer values:

            - `1` = input answer is correct
            - `0` = input answer is incorrect
            - `-1` = Answer contains other characters
            - `-2`= Answer is given in the wrong form (SOP/POS, does not guarantee correctness)
            - `-3`= Any other error caught by the checker (ideally should not be returned)
    
    """
    # Input parser
    try:
        if all(char in ['A', 'B', 'C', 'D', 'E', 'F', '\'', ' ', '(', ')', '+'] for char in input_answer) == False: 
            raise ValueError('Answer contains other characters besides ABCD\'()+.')
        else:
            input_answer = input_answer.replace(' ', '')
            if form_answer == "min":
                # Group minterms
                input_answer = input_answer.replace("(", '').replace(")", '').split('+')

                # Answer check
                if len(input_answer) == 0:
                    raise IndexError('Answer is given as POS, not SOP form.')

                # Group literals
                for i in range(len(input_answer)): # Loop through minterms
                    temp_term = []
                    for j in range(len(input_answer[i])): # Loop through literals
                        char = input_answer[i][j]
                        if char == '\'':
                            temp_term[-1] = temp_term[-1] + '\''
                        else:
                            temp_term.append(char)
                    input_answer[i] = set(temp_term)

            elif form_answer == "max":
                # Group maxterms
                input_answer = input_answer.split(')(')

                # Answer check
                if len(input_answer) == 0:
                    raise IndexError('Answer is given as SOP, not POS form.')

                # Clean max terms of parentheses and group literals
                for i in range(len(input_answer)):
                    input_answer[i] = set(input_answer[i].strip('()').split('+'))

            # print("Input answer:", input_answer)


    except ValueError: # Answer contains other characters besides ABCD\'()+.
        return -1
    except IndexError: # Answer is given in wrong form (SOP/POS).
        return -2
    except: # Catch all, answer is given in wrong format.
        return -3
    
    # Checker proper
    for answer in minimal_expressions:
        for term in input_answer:
            if term in answer:
                continue
            else:
                break
        else:
            # print("Answer is right!")
            return 1
    else:
        # print("Answer is wrong!")
        return 0



def stringifyExpression(expression: list[set[str]], form_answer: str = "min") -> str:
    """
    Changes a boolean expression in minimal SOP/POS form into a string.

    :param minimal_expression: A minimal expression given as a list of terms, which are represented as a set of strings.
    :type minimal_expression: list[set[str]]
    :param form_terms: `"min"` or `"max"`, determines if the given terms are minterms or maxterms. Defaults to `"min"`.
    :type form_terms: str, optional

    :rtype: str
    :returns:  String equivalent of the given minimal expression.
    """
    stringified_expression = ""
    if form_answer == "min":
        expression.sort(key = lambda answer: len(answer))
        for i in range(len(expression)): # loop through every term
            if i != 0:
                stringified_expression += " + "
            term = sorted(expression[i])
            for literal in term:
                stringified_expression += literal
    if form_answer == "max":
        expression.sort(key = lambda answer: len(answer))
        for i in range(len(expression)): # loop through every term
            if i != 0:
                stringified_expression += " "
            stringified_expression += "("    
            term = sorted(expression[i])
            for j in range(len(term)):
                if j != 0:
                   stringified_expression += "+" 
                literal = term[j]
                stringified_expression += literal
            stringified_expression += ")"

    return stringified_expression

def minimizeAndCheck(   
        num_var: int, 
        terms: list[int], 
        dont_cares: list[int] = [],  
        form_terms: str = "min",
        input_answer: str = ""
        ):
    prime_implicants = getPrimeImplicants(num_var=num_var, terms=terms, dont_cares=dont_cares, form_terms=form_terms)
    final_expressions = minimizePrimeImplicants(num_var=num_var, terms=terms, prime_implicants=prime_implicants, form_terms=form_terms)
    result = checkAnswer(minimal_expressions=final_expressions, input_answer=input_answer, form_answer=form_terms)
    return result

if __name__ == "__main__":
    import requests

    # Running server needed!
    users = requests.get("http://localhost:8000/user").json()
    username = "a"
    user = next(user for user in users if user['username'] == username)
    num_var = user['q_num_var']
    terms = user['q_terms']
    dont_cares = user['q_dont_cares']
    form_terms = user['q_form']
    # num_var, form_terms, terms, dont_cares = randomizeQuestion(4)
    print("Number of variables:", num_var, "Form:", form_terms)
    print("Terms:", terms)
    print("Don't cares", dont_cares)
    input_answer = "(A'+C+D') (A'+D+E) (A+B'+D+E') (A+C+D+E') (A+B'+C'+D'+E)"

    prime_implicants = getPrimeImplicants(num_var=num_var, terms=terms, dont_cares=dont_cares, form_terms=form_terms)
    # print("Prime implicants:", prime_implicants)
    final_expressions = minimizePrimeImplicants(num_var=num_var, terms=terms, prime_implicants=prime_implicants, form_terms=form_terms)
    # print("Minimal expressions:", final_expressions)
    if len(final_expressions) == 1:
        stringified_expression = stringifyExpression(expression=final_expressions[0], form_answer=form_terms)
        print("Correct answer:", stringified_expression)
    else:
        for i in range(len(final_expressions)):
            stringified_expression = stringifyExpression(expression=final_expressions[i], form_answer=form_terms)
            print(f"Correct answer {i}:", stringified_expression)
    print("Given answer", input_answer)

    result = checkAnswer(minimal_expressions=final_expressions, input_answer=input_answer, form_answer=form_terms)
    if result == 1:
        print("Correct!")
    elif result == 0:
        print("Wrong.")
    elif result == -1:
        print("Invalid characters present.")
    elif result == -2:
        print("Wrong form (SOP/POS).")
    elif result == -3:
        print("Error: please contact dev.")