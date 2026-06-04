# import os
# from config import *
# import vote_authority # call func decode

# def end_election():
#     print("\n" + "="*20 + " ENDING ELECTION PROCESS " + "="*20)

#     #check status voting

#     if not os.path.exists("vote_status.txt"):
#         print("[1] Error: system state not found\n")
#         return
#     # confirm ened from qtv 

#     confirm = input("Are you sure that you wanna finish the eelection and calcualte the reusult (y/n): ")    
#     if confirm.lower() != 'y':
#         print("The action has been canceled...")
#         return
    
#     # status --> 1

#     with open("vote_status.txt", "w") as f:
#         f.write("1")

#     print("\n[1] Status: The election is closed. No more voting is possible..")

#     # check server
#     # 

#     if not os.path.exists("homomorphic_vote.txt"):
#         print("[2] Notification: Waiting for the server to consolidate the homomorphic data...")      
#         #can automatic 
#         #homomorphic_server.aggregate_votes()

#         print("pls ensure run homomorphic_server.py before decoding")
#         return
    
#     #call authority to decode

#     print("Sending a decryption request to the vote authority")

#     try:
#         vote_authority.decrypt_final_result()
#         print("\n--- Process for succesful completion --- ")
#     except Exception as e:
#         print(f"deconding error: {e}")

# if __name__ == "__main__":
#     end_election()
     
import os
from config import *
import vote_authority
import homomorphic_server


def end_election():

    print("\n" + "=" * 20 + " ENDING ELECTION PROCESS " + "=" * 20)

    # Check election status file
    if not os.path.exists("vote_status.txt"):
        print("[!] Error: vote_status.txt not found")
        return

    # Read current status
    with open("vote_status.txt", "r") as f:
        status = f.read().strip()

    if status == '1':
        print(" Election already ended")
        return

    # Confirmation
    confirm = input(
        "Are you sure you want to end the election and calculate results? (y/n): "
    )

    if confirm.lower() != 'y':
        print("Operation cancelled")
        return

    # Close election
    with open("vote_status.txt", "w") as f:
        f.write("1")

    print("\n[1] Election closed successfully")

    # Aggregate votes automatically
    print("\n[2] Aggregating encrypted votes...")
    homomorphic_server.aggregate_votes()

    # Decrypt final result
    print("\n[3] Decrypting final result...")

    try:
        vote_authority.decrypt_final_result()
        print("\n Election completed successfully")

    except Exception as e:
        print(f"Decryption error: {e}")


if __name__ == "__main__":
    end_election()