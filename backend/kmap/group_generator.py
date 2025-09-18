import numpy as np
import itertools
import math


def generateTerms(num_var):
    """
    Generates all possible terms in a K-Map given the number of variables.
    """

    match num_var:
        case 2: 
            shape = (2, 2)
            terms = np.reshape(np.arange(2**num_var), shape)
        case 3: 
            shape = (2, 4)
            terms = np.reshape(np.arange(2**num_var), shape)
            terms[:, [2, 3]] = terms[:, [3, 2]]
        case 4:
            shape = (4, 4)
            terms = np.reshape(np.arange(2**num_var), shape)
            terms[[2, 3], :] = terms[[3, 2], :]
            terms[:, [2, 3]] = terms[:, [3, 2]]
        case 5: 
            shape = (2, 4, 4)
            terms = np.reshape(np.arange(2**num_var), shape)
            terms[:, [2, 3], :] = terms[:, [3, 2], :]
            terms[:, :, [2, 3]] = terms[:, :, [3, 2]]
        case 6:
            shape = (2, 2, 4, 4)
            terms = np.reshape(np.arange(2**num_var), shape)
            terms[:, :, [2, 3], :] = terms[:, :, [3, 2], :]
            terms[:, :, :, [2, 3]] = terms[:, :, :, [3, 2]]
            
    return shape, terms

def generateGroups(num_var):
    """
    Generates all possible groups in a K-Map given the number of variables.
    Updated version.
    """

    shape, terms = generateTerms(num_var)
    groups = [[] for _ in range(num_var)]

    # Duplicate the last row when size of dimension is 4 (for groups that wrap at the ends)
    for a in range(len(terms.shape)):
        axis = terms.shape[a]
        if axis == 4:
            terms = np.insert(terms, 4, np.take(terms, 0, axis=a), axis=a)

    # Generate a list of all possible groups with the given shape
    ranges = [range(1, dim + 1) for dim in shape]
    group_shapes = [s for s in itertools.product(*ranges) if (math.log2(np.prod(s)) == round(math.log2(np.prod(s))) and np.prod(s) < np.prod(shape))]

    for s in group_shapes:
        # Get all possible groups with given size
        curr_groups = np.reshape(np.lib.stride_tricks.sliding_window_view(terms, s), (-1, np.prod(s))).tolist()
        # Remove repeating elements
        curr_groups = [set(item) for item in set(frozenset(item) for item in curr_groups)]
        curr_groups = sorted(curr_groups, key=min)
        # Insert groups
        groups[int(math.log2(np.prod(s)))].extend(curr_groups)
    
    return groups


if __name__ == "__main__":
    
    # Test code
    num_var = 5
    possible_groups = generateGroups(num_var)
    for i in range(len(possible_groups)):
        print(f"Group size {i}")
        print(sorted(possible_groups[i], key=lambda x: sorted(list(x))), "\n")