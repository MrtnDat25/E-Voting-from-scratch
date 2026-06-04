import os
import random
import math
from config import *


#secure
from Crypto.Util.number import getPrime
from secrets import randbelow

p = getPrime(512)
q = getPrime(512)



#function math
def gcd(a, b):
    while b:
        a , b = b , a % b
    return a

def lcm(x,y):
    if x == 0 or y == 0 : return 0
    return abs(x*y)// gcd(x,y)
#--> gcd , lcm --> value \lambda

def egcd(a , b):
    if a == 0:
        return (b,0,1)
    else:
        g , y , x = egcd(b%a,a)
        return (g,x-(b//a)*y,y)

def modinv(a , m ):
    g , x , y = egcd(a , m )
    if g != 1 :
        return -1
    else:  
        return x % m 
    
#--> egcd , modinv --> value \mu
def is_prime(n):
    if n < 2: return False
    for i in range(2, int(math.sqrt(n))+1):
        if n % i == 0: return False

    return True


def generate_two_primes(low, high):
    primes = []
    candidates = list(range(low,high))
    random.shuffle(candidates)
    for num in candidates:
        if is_prime(num):
            primes.append(num)
        if len(primes) == 2:
            break
    return primes

def generate_data():
    
    all_values_found = False
    n , g , L , meu, p , q = 0,0,0,0,0,0
    while not all_values_found:
        primes = generate_two_primes(PRIME_LOWER_BOUND, PRIME_UPPER_BOUND)
        if len(primes) < 2:
            print(f"Error: No enough prime in range {PRIME_LOWER_BOUND} - {PRIME_UPPER_BOUND}")
            return #
        
        p , q = primes[0], primes[1]

        if gcd( p*q , (p-1)*(q-1) )  !=1:
            print("Regenerating p and q")
            continue
        
        n = q * p

        if n < MIN_N_VALUE:
            print(f"n is too small, pls >= {MIN_N_VALUE}")
            continue # while

        # generate g, \lambda , \mu
        #g  =random.randrange(1, n **2+1)
        g = n + 1
        L = lcm(p - 1 , q - 1)
        u = pow(g, L , n*n)
        k = (u-1)//n
        meu = modinv(k , n)
        if meu == -1:
            print("Redoing the generation! modulo inverse not found!")
        else:
            all_values_found = True
    #generate data file
    with open("public.txt" , "w") as f: f.write(f"{n}\n{g}") #--> ( n , g)

    with open("private.txt" , "w") as f : f.write(f"{n}\n{L}\n{meu}")# --> ( n , \lambda , \mu)

    #create list voter

    with open("voter.txt", "w") as f:
        for i in range(1, MAX_VOTERS + 1):
            f.write(f"Voter{i} {i} 0 - 1\n")

    #rs status
    with open("vote_status.txt" ,"w") as f: f.write("0")
    for file in ["encrypted_vote.txt" , "homomorphic_vote.txt"]:
        if os.path.exists(file): os.remove(file)

    #test

    print(f"The value of n is: {n}")
    print(f"The public-key (n,g) := {n} , {g}")
    print(f"The value of \\lambda is: {L}")
    print(f"The value of k is := {k}")
    print(f"The value of \\mu is := {meu}")
    print(f"The private-key (\\lambda ,\\mu) is := {L}, {meu}")


def decrypt_final_result():
    """ decrption total homomorphic from server and determine the winner of the election"""
    if not os.path.exists("homomorphic_vote.txt"):
        print("Error: No found file homomorphic_vote.txt from server")
        return
    
    with open("private.txt") as f : 
        n = int(f.readline())
        L = int(f.readline())
        meu = int(f.readline())
    
    with open("homomorphic_vote.txt", "r") as f:
        total_encrypted = int(f.read().strip())

    #decrpyte
    n_sq = n*n
    decrypt_sum = ((((pow(total_encrypted, L, n_sq) - 1) // n)) * meu) % n

    # separate results and find the winner
    mask = (1 << NUM_BITS) - 1 
    results = []

    print("\n" + "= "*30)
    print("Final Voting Results")
    print("="*30)
    for i in range(NUM_CANDIDATES):
        count = (decrypt_sum >> (i * NUM_BITS)) & mask
        results.append(count)

        print(f"Candidate {i} : {count} vote(s)")

        print("-"*30)

        #logic
    max_votes = max(results)
    if max_votes == 0:
        print("Result: No one voted")
    else:
            # draw situation
        winners = [
                    i for i , votes in enumerate(results) 
                    if votes == max_votes
                  ]

        if len(winners) > 1:
            winners_name = ", ".join([f"Candidate {w}" for w in winners])

            print(f"DRAW Result: {winners_name}")
            print(f"With the number of votes: {max_votes}")

        else:
            print(f"Congratulations: The candidate {winners[0]} is winner")
            print(f"Total of votes : {max_votes}")

    print("="*30)

def test_paillier():
    print("\n" + "-"*15 + " Testing " + "-"*15)
    try:
        with open("public.txt" , "r" ) as f:
            n , g = int(f.readline()), int(f.readline())
        with open("private.txt", "r") as f:
            n , L , meu = int(f.readline()) , int(f.readline()), int(f.readline())

        m = int(input(f"Enter the value of Messagge 'm' (as integer), m <{n} : "))
        r = int(input(f"Enter the value of 'r' (as integer): "))
        if gcd(r, n) != 1:
            print("r must be coprime with n")
            return
        n_sq = n**2
        c = (pow(g,m,n_sq) * pow(r,n,n_sq) ) % n_sq
        print(f"Ciphertext, C := {c}")

        m_extracted = ((((pow(c, L, n_sq) - 1) // n)) * meu) % n

        print(f"Extracted Message, M := {m_extracted}")


    
    except Exception as e:
        print(f"Test error: {e}")



if __name__ == '__main__':
    print("Python file for Voting Authority")
    print("Enter\n1 for data and paillier key generation\n2 for decrpted the homomorphic value from server for final result: ", end="\n")
    choice = input()

    if choice == '1': 
        generate_data()
        print("Do u wanna test the Paillier encryption key? Press 1 for yes and other any for no: ",end ="")
        if input() == '1':
            test_paillier()
    elif choice == '2':
        decrypt_final_result()




#review

    """
prime generation yếu --> crypto
store private key
authentication vote --> check validation of voter (id --> age, digital signature, token , blind signature )
    digital --> defense against fake vote
    ZIKP --> check vote , no reveal vote

recure random ( random.randint ) --> from sercets improt randbelow
proccessing from db not txt

    """
    