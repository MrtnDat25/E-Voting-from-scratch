import os
from config import *
import random
import uuid
from secrets import randbelow


#function

def encrypted_vote(m , n , g):
    """ Paillier cryptosystem c = (g^m * r^n) mod n^2"""

    n_sq = n ** 2

    #choice random r (r , n) = 1
    #r = random.randint(1, n -1)

    while True:
        r = randbelow(n-1) + 1
        if math.gcd(r,n) == 1:
            break

    #formula paillier
    c = ( pow(g , m , n_sq ) * pow( r , n , n_sq)) % n_sq

    return c

def main():
    print('-' * 30)
    print("E-voting Sysyem")
    print('-' * 30)

    #1. check status = 1 --> end vote

    if os.path.exists("vote_status.txt"):
        with open("vote_status.txt", "r") as f:
            status = f.read().strip()
            if status == '1':
                print("\n[!] Announcment: The voting has ENDED...")
                print("The system is closed. Cant vote at this time...")
                print('-' * 30)
                return
        
    #2. check n read public key

    if not os.path.exists("public.txt"):
        print("Error: the system has not been initialized from vote_authority.py")
        return 
    
    with open("public.txt" , "r" ) as f:
        n = int(f.readline())
        g = int(f.readline())
    
    #3. validation

    voter_id_input = input("Enter your Vote ID: ").strip()
    votesr_data =[]

    current_voter = None

    if not os.path.exists("voter.txt"):
        print("Error: Voter list (vote.txt) not found")
        return
    with open("voter.txt" , "r") as f:
        for line in f:
            parts = line.strip().split()
            if len(parts) >= 4:
                if parts[1] == voter_id_input:
                    current_voter = parts
                votesr_data.append(parts)

    if not current_voter :
        print("The voter ID does not exist on the list")

        return
    
    if current_voter[2] == '1':
        print(f"\nWelcome {current_voter[0]}, You have already voted ...")
        print(f"Vote for your loopup ID: {current_voter[3]}")

        return
    

    #Choice candidate

    print(f"Verification successful~ welcome {current_voter[0]}")
    print(f"List of candidates (0 - {NUM_CANDIDATES - 1 } )")

    try:
        choice = int(input("Enter the candidate number you have chosen: "))
        if choice < 0 or choice >= NUM_CANDIDATES:
            print("Invalid selection")
            return
    except ValueError:
        print("Pls enter a number")
        return
    
    #encode by bit-packing

    m = 1 << (choice * NUM_BITS)
    encrypted_ballot = encrypted_vote(m , n , g)

    #pk vote_id
    vote_id = str(uuid.uuid4())

    #save --> encryopted_vote.txt

    with open("encrypted_vote.txt" , "a") as f:
        f.write(f"{encrypted_ballot}\n")

    with open("bulletin_board.txt" , "a") as f:
        f.write(f"{vote_id} {encrypted_ballot}\n")

    #update status

    with open("voter.txt" , "w") as f:
        for v in votesr_data:
            if v[1] == voter_id_input:
                v[2] = '1' # voted
                v[3] = vote_id # save voter_id

            f.write(f"{v[0]} {v[1]} {v[2]} {v[3]}\n")

    #result

    print("\n" + "="*50)
    print("Voiting Successful")
    print(f"Your Vote ID: {vote_id}")
    print("You can usse this code to check the ballot on the Bullentin Board...")
    print("="*50)

if __name__ == "__main__":
    main()
