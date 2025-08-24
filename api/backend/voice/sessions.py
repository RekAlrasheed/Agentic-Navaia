from http.server import BaseHTTPRequestHandler
import json
import sqlite3
import os
from datetime import datetime
from urllib.parse import parse_qs

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        """Create a new voice session"""
        try:
            # Read request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # Extract data
            customer_id = data.get('customer_id', f'customer_{int(datetime.now().timestamp())}')
            direction = data.get('direction', 'inbound')
            locale = data.get('locale', 'ar-SA')
            simulation = data.get('simulation', False)
            
            # Create in-memory database (for Vercel serverless)
            conn = sqlite3.connect(':memory:')
            cursor = conn.cursor()
            
            # Create table
            cursor.execute('''
                CREATE TABLE voice_sessions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT UNIQUE NOT NULL,
                    customer_id TEXT NOT NULL,
                    direction TEXT NOT NULL,
                    locale TEXT NOT NULL,
                    simulation BOOLEAN NOT NULL,
                    status TEXT NOT NULL DEFAULT 'created',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    ended_at TIMESTAMP NULL
                )
            ''')
            
            # Generate session ID
            session_id = f'session_{int(datetime.now().timestamp())}_{customer_id}'
            
            # Insert session
            cursor.execute('''
                INSERT INTO voice_sessions 
                (session_id, customer_id, direction, locale, simulation, status)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (session_id, customer_id, direction, locale, simulation, 'created'))
            
            conn.commit()
            
            # Get the created session
            cursor.execute('SELECT * FROM voice_sessions WHERE session_id = ?', (session_id,))
            session = cursor.fetchone()
            
            conn.close()
            
            if session:
                session_data = {
                    'session_id': session[1],
                    'customer_id': session[2],
                    'direction': session[3], 
                    'locale': session[4],
                    'simulation': bool(session[5]),
                    'status': session[6],
                    'created_at': session[7]
                }
                
                # Return success response
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
                self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                self.end_headers()
                
                response = json.dumps(session_data)
                self.wfile.write(response.encode('utf-8'))
            else:
                raise Exception("Failed to create session")
                
        except Exception as e:
            # Return error response
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            error_response = json.dumps({'error': str(e)})
            self.wfile.write(error_response.encode('utf-8'))
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
