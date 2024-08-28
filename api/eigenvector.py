import networkx as nx
import sqlite3
from datetime import datetime

def calculate_influence():
    # Connect to your database
    conn = sqlite3.connect('../prisma/dev.db')
    cursor = conn.cursor()

    # Fetch users and their details
    cursor.execute('SELECT id, name, followers, joinDate FROM User')
    users = cursor.fetchall()

    # Fetch tweets and their details
    cursor.execute('SELECT authorId, likes, retweets, createdAt FROM Tweet')
    tweets = cursor.fetchall()

    conn.close()

    # Create a directed graph
    G = nx.DiGraph()

    # Add nodes (users)
    for user in users:
        G.add_node(user[0], name=user[1], followers=user[2], joinDate=user[3])

    # Add edges (retweet relationships)
    for tweet in tweets:
        if tweet[2] > 0:  # If retweets > 0
            G.add_edge(tweet[0], tweet[0])  # Simplified for example

    # Calculate eigenvector centrality
    eigenvector_centrality_data = nx.eigenvector_centrality_numpy(G)

    # Calculate influence score
    influence_scores = []
    for user in users:
        user_id = user[0]
        followers = user[2]
        join_date_timestamp = user[3] / 1000  # Convert milliseconds to seconds
        join_date = datetime.fromtimestamp(join_date_timestamp)
        account_age = (datetime.now() - join_date).days

        # Calculate tweet metrics
        user_tweets = [tweet for tweet in tweets if tweet[0] == user_id]
        total_likes = sum(tweet[1] for tweet in user_tweets)
        total_retweets = sum(tweet[2] for tweet in user_tweets)
        total_replies = len(user_tweets)  # Simplified for example

        # Define weights for each factor
        weights = {
            'followers': 0.3,
            'retweets': 0.25,
            'likes': 0.2,
            'replies': 0.15,
            'account_age': 0.1,
            'eigenvector_centrality': 0.5
        }

        # Calculate influence score
        influence_score = (
                weights['followers'] * followers +
                weights['retweets'] * total_retweets +
                weights['likes'] * total_likes +
                weights['replies'] * total_replies +
                weights['account_age'] * account_age +
                weights['eigenvector_centrality'] * eigenvector_centrality_data.get(user_id, 0)
        )

        influence_scores.append({
            'id': user_id,
            'name': user[1],
            'influence_score': influence_score
        })

    return influence_scores

if __name__ == '__main__':
    print(calculate_influence())
