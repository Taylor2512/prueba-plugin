import os
path = '/Users/desarrollo1/Library/Application Support/Code - Insiders/User/workspaceStorage/4992f12a8f6923fd4d86ec6788a538a9/GitHub.copilot-chat/chat-session-resources/ac7ca255-4170-47e5-bd7b-2d7b897708a9/call_MHx6RTJ3WTdQT3c5RkpKdHdNQkk__vscode-1776706927558/content.txt'
if os.path.exists(path):
    with open(path, 'r') as f:
        print(f.read())
