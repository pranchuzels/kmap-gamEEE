"""
Generate all possible groups in a K-Map.
Go through each term and use it as the topleft-most element of every group.
"""

import numpy as np

terms_2 = np.array([[0, 1], 
        [2, 3]])
terms_3 = np.array([[0, 1, 3, 2], 
        [4, 5, 7, 6]])
terms_4 = np.array([[0, 1, 3, 2], 
        [4, 5, 7, 6], 
        [12, 13, 15, 14], 
        [8, 9, 11, 10]])
terms_5 = np.array([[[0, 1, 3, 2], 
        [4, 5, 7, 6], 
        [12, 13, 15, 14], 
        [8, 9, 11, 10]],
        [[16, 17, 19, 18], 
        [20, 21, 23, 22], 
        [28, 29, 31, 30], 
        [24, 25, 27, 26]]])
terms_6 = np.array([[[[0, 1, 3, 2], 
        [4, 5, 7, 6], 
        [12, 13, 15, 14], 
        [8, 9, 11, 10]],
        [[16, 17, 19, 18], 
        [20, 21, 23, 22], 
        [28, 29, 31, 30], 
        [24, 25, 27, 26]]],
        [[[32, 33, 35, 34], 
        [36, 37, 39, 38], 
        [44, 45, 47, 46], 
        [40, 41, 43, 42]],
        [[48, 49, 51, 50], 
        [52, 53, 55, 54], 
        [60, 61, 63, 62], 
        [56, 57, 59, 58]]]])

def generateGroups(num_var):

    match num_var:
        case 2:
            terms = terms_2
        case 3:
            terms = terms_3
        case 4:
            terms = terms_4
        case 5:
            terms = terms_5
        case 6:
            terms = terms_6

    possible_groups = [[] for _ in range(num_var)]

    for i in range(num_var): # go through all possible group sizes
        for idx, term in np.ndenumerate(terms):
            match i:
                case 0:
                    possible_groups[0].append(set([term]))
                case 1:
                    for j in range(len(idx)):
                        temp_group = set([term])
                        temp_idx = list(idx)
                        temp_idx[j] = (idx[j] + 1) % terms.shape[j]
                        temp_group.add(terms[(tuple(temp_idx))])
                        if temp_group not in possible_groups[1]:
                            possible_groups[1].append(temp_group)
                case 2:
                    for j in range(len(idx)):
                        # add 4 x 1
                        if terms.shape[j] == 4:
                            temp_group = set([term])
                            for k in range(1, 4):
                                temp_idx = list(idx)
                                temp_idx[j] = (idx[j] + k) % terms.shape[j]
                                temp_group.add(terms[(tuple(temp_idx))])
                            if temp_group not in possible_groups[2]:
                                possible_groups[2].append(temp_group)
                        # add 2 x 2
                        for k in range(len(idx)):
                            if j == k:
                                continue
                            temp_group = set([term])

                            temp_idx = list(idx)
                            temp_idx[j] = (idx[j] + 1) % terms.shape[j]
                            temp_group.add(terms[(tuple(temp_idx))])

                            temp_idx = list(idx)
                            temp_idx[k] = (idx[k] + 1) % terms.shape[k]
                            temp_group.add(terms[(tuple(temp_idx))])

                            temp_idx = list(idx)
                            temp_idx[j] = (idx[j] + 1) % terms.shape[j]
                            temp_idx[k] = (idx[k] + 1) % terms.shape[k]
                            temp_group.add(terms[(tuple(temp_idx))])

                            if temp_group not in possible_groups[2]:
                                possible_groups[2].append(temp_group)

                case 3:
                    for j in range(len(idx)):
                        # add 4 x 2
                        for k in range(len(idx)):
                            if j == k:
                                continue
                            elif terms.shape[k] == 4:
                                temp_group = set([])
                                for l in range(0, 2):
                                    for m in range(0, 4):
                                        temp_idx = list(idx)
                                        temp_idx[j] = (idx[j] + l) % terms.shape[j]
                                        temp_idx[k] = (idx[k] + m) % terms.shape[k]
                                        temp_group.add(terms[(tuple(temp_idx))])
                                if temp_group not in possible_groups[3]:
                                    possible_groups[3].append(temp_group)
                        # add 2 x 2 x 2
                        for k in range(len(idx)):
                            if j == k:
                                continue
                            for l in range(len(idx)):
                                if l == j or l == k:
                                    continue
                                temp_group = set([])
                                for m in range(0, 2):
                                    for n in range(0, 2):
                                        for o in range(0, 2):
                                            temp_idx = list(idx)
                                            temp_idx[j] = (idx[j] + m) % terms.shape[j]
                                            temp_idx[k] = (idx[k] + n) % terms.shape[k]
                                            temp_idx[l] = (idx[l] + o) % terms.shape[l]
                                            temp_group.add(terms[(tuple(temp_idx))])

                                if temp_group not in possible_groups[3]:
                                    possible_groups[3].append(temp_group)

                case 4:
                    
                    for j in range(len(idx)):
                        for k in range(len(idx)):

                            # add 4 x 4
                            if j == k:
                                continue
                            elif terms.shape[j] == 4 and terms.shape[k] == 4:
                                temp_group = set([])
                                for l in range(0, 4):
                                    for m in range(0, 4):
                                        temp_idx = list(idx)
                                        temp_idx[j] = (idx[j] + l) % terms.shape[j]
                                        temp_idx[k] = (idx[k] + m) % terms.shape[k]
                                        temp_group.add(terms[(tuple(temp_idx))])
                                if temp_group not in possible_groups[4]:
                                    possible_groups[4].append(temp_group) 
                            
                            # add 2 x 2 x 4
                            for l in range(len(idx)):
                                if l == j or l == k:
                                    continue
                                elif terms.shape[l] == 4:
                                    temp_group = set([])
                                    for m in range(0, 2):
                                        for n in range(0, 2):
                                            for o in range(0, 4):
                                                temp_idx = list(idx)
                                                temp_idx[j] = (idx[j] + m) % terms.shape[j]
                                                temp_idx[k] = (idx[k] + n) % terms.shape[k]
                                                temp_idx[l] = (idx[l] + o) % terms.shape[l]
                                                temp_group.add(terms[(tuple(temp_idx))])
                                    if temp_group not in possible_groups[4]:
                                        possible_groups[4].append(temp_group)

                case 5:
                    for j in range(len(idx)):
                        for k in range(len(idx)):
                            for l in range(len(idx)):
                                # add 4 x 4 x 2
                                if j == k or j == l or k == l:
                                    continue
                                elif terms.shape[j] == 4 and terms.shape[k] == 4:
                                    temp_group = set([])
                                    for m in range(0, 4):
                                        for n in range(0, 4):
                                            for o in range(0, 2):
                                                temp_idx = list(idx)
                                                temp_idx[j] = (idx[j] + m) % terms.shape[j]
                                                temp_idx[k] = (idx[k] + n) % terms.shape[k]
                                                temp_idx[l] = (idx[l] + o) % terms.shape[l]
                                                temp_group.add(terms[(tuple(temp_idx))])
                                    if temp_group not in possible_groups[5]:
                                        possible_groups[5].append(temp_group)

                                # add 4 x 2 x 2 x 2
                                if terms.shape[j] == 4:
                                    for m in range(len(idx)):
                                        if m == j or m == k or m == l:
                                            continue
                                        temp_group = set([])
                                        for n in range(0, 4):
                                            for o in range(0, 2):
                                                for p in range(0, 2):
                                                    for q in range(0, 2):
                                                        temp_idx = list(idx)
                                                        temp_idx[j] = (idx[j] + n) % terms.shape[j]
                                                        temp_idx[k] = (idx[k] + o) % terms.shape[k]
                                                        temp_idx[l] = (idx[l] + p) % terms.shape[l]
                                                        temp_idx[m] = (idx[m] + q) % terms.shape[m]
                                                        temp_group.add(terms[(tuple(temp_idx))])
                                        if temp_group not in possible_groups[5]:
                                            possible_groups[5].append(temp_group)


    return possible_groups

if __name__ == "__main__":
    
    num_var = 4
    possible_groups = generateGroups(num_var)
    for i in range(len(possible_groups)):
        print(f"Group size {i}")
        print(sorted(possible_groups[i], key=lambda x: sorted(list(x))), "\n")