import os 
from config import *

def aggregate_votes():
    print(" ----- Homomorphic aggregation server ----- ")

    #read from public.text --> n ** n 
    
    #read n from 
    if not os.path.exists("public.txt"):
        print("Error : Public key not found")
        return

    #take n
    with open("public.txt", "r") as f:
        n = int(f.readline())

    n_sq = n ** 2
    
    #check votes

    if not os.path.exists("encrypted_vote.txt"):# after voted
        print("Error: No balllots are in the systerm")
        return

    #Calculate multiphication homomorphism
    # E(m1+m2)  = E(m1).E(m2)
    total_encrypted = 1
    count = 0

    with open("encrypted_vote.txt" , "r") as f:
        for line in f:
            if line.strip():
                encrypted_ballot = int(line.strip())
                
                total_encrypted = (total_encrypted * encrypted_ballot) % n_sq
                count +=1
    # save total to file homomorhic_vote
    with open("homomorphic_vote.txt" , "w" ) as f:
        f.write(str(total_encrypted))

    
    print(f"A total of {count} votes has been processed....")
    print(f'The aggregeated (encoded) resutls have been saved to homomorphic_vote.txt')
    print(f"serrver completees task")



if __name__ == "__main__":
    aggregate_votes()


