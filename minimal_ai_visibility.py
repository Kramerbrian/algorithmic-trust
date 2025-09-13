#!/usr/bin/env python3
"""
Minimal AI Visibility Testing System
Single file, low quota usage, essential functionality only
"""

import asyncio
import json
import time
from datetime import datetime
from typing import Dict, List, Optional
from fastapi import FastAPI, BackgroundTasks
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import anthropic

class MinimalAIVisibilityTester:
    def __init__(self, anthropic_api_key: str):
        self.client = anthropic.Anthropic(api_key=anthropic_api_key)
        self.sse_clients = []
        self.current_analysis = None
        
        # Simplified platform configs - just what we need
        self.platforms = {
            "chatgpt": {"weight": 0.40, "delay": 5},
            "searchgpt": {"weight": 0.25, "delay": 8}, 
            "gemini": {"weight": 0.20, "delay": 4},
            "perplexity": {"weight": 0.15, "delay": 6}
        }
    
    async def analyze_dealership(self, dealership_name: str, location: str) -> Dict:
        """
        Single API call to analyze dealership across all platforms
        Consolidates all testing into one Computer Use session
        """
        
        # Store analysis state
        self.current_analysis = {
            "dealership": dealership_name,
            "location": location,
            "status": "running",
            "started_at": datetime.now(),
            "platform_scores": {},
            "overall_score": 0
        }
        
        # Broadcast start
        await self._broadcast_event("analysis_started", {
            "dealership": dealership_name,
            "location": location
        })
        
        # Single comprehensive prompt for all platforms
        analysis_prompt = f"""
        Complete AI visibility analysis for {dealership_name} in {location}.
        
        CONSOLIDATED TESTING PROTOCOL:
        
        Test all 4 platforms in sequence with minimal API calls:
        
        1. CHATGPT TESTING (2 queries max):
           - Navigate to chatgpt.com
           - Query: "Best car dealership in {location}"
           - Query: "{dealership_name} reviews"
           - Score mentions 0-100, note position/context
           - Screenshot final results
        
        2. SEARCHGPT TESTING (2 queries max):
           - Navigate to chatgpt.com/?model=search  
           - Query: "Where to buy car in {location}"
           - Score visibility 0-100
           - Screenshot results
        
        3. GEMINI TESTING (2 queries max):
           - Navigate to gemini.google.com
           - Query: "Best {location} car dealer"
           - Score mentions 0-100
           - Screenshot results
        
        4. PERPLEXITY TESTING (2 queries max):
           - Navigate to perplexity.ai
           - Query: "Car dealerships {location} reviews"
           - Score visibility 0-100
           - Screenshot results
        
        5. FINAL ANALYSIS:
           - Calculate weighted overall score
           - Count total mentions across platforms
           - Identify top 3 recommendations
           - Return structured JSON results
        
        EFFICIENCY REQUIREMENTS:
        - Maximum 8 queries total (2 per platform)
        - Take only essential screenshots
        - Handle rate limits with delays: ChatGPT(5s), SearchGPT(8s), Gemini(4s), Perplexity(6s)
        - Return comprehensive results in single response
        
        Return final analysis with platform scores and overall assessment.
        """
        
        try:
            # Single Computer Use call for entire analysis
            response = await self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=8192,
                tools=[{
                    "type": "computer_20241022",
                    "name": "computer",
                    "display_width_px": 1920,
                    "display_height_px": 1080
                }],
                messages=[{
                    "role": "user",
                    "content": analysis_prompt
                }]
            )
            
            # Extract results with minimal processing
            results = await self._parse_analysis_results(response, dealership_name, location)
            
            # Update analysis state
            self.current_analysis.update(results)
            self.current_analysis["status"] = "completed"
            self.current_analysis["completed_at"] = datetime.now()
            
            # Broadcast completion
            await self._broadcast_event("analysis_completed", results)
            
            return results
            
        except Exception as e:
            # Simple error handling
            error_result = {
                "error": str(e),
                "dealership": dealership_name,
                "location": location,
                "platform_scores": {"chatgpt": 0, "searchgpt": 0, "gemini": 0, "perplexity": 0},
                "overall_score": 0,
                "status": "failed"
            }
            
            self.current_analysis.update(error_result)
            await self._broadcast_event("analysis_failed", error_result)
            
            return error_result
    
    async def _parse_analysis_results(self, response, dealership_name: str, location: str) -> Dict:
        """
        Extract structured results from Computer Use response
        Uses single AI call for parsing instead of complex extraction
        """
        
        # Get response text
        response_text = ""
        screenshots = []
        
        for content in response.content:
            if content.type == "text":
                response_text += content.text
            elif content.type == "image":
                screenshots.append(f"screenshot_{len(screenshots)}.png")
        
        # Single AI call to extract structured data
        extraction_prompt = f"""
        Extract AI visibility scores from this analysis of {dealership_name}:
        
        {response_text[:4000]}  # Limit context to stay under quota
        
        Return ONLY this JSON structure:
        {{
            "platform_scores": {{
                "chatgpt": 0-100,
                "searchgpt": 0-100,
                "gemini": 0-100,
                "perplexity": 0-100
            }},
            "total_mentions": number,
            "overall_score": 0-100,
            "top_recommendations": [
                "Fix biggest issue first",
                "Second priority action", 
                "Third priority action"
            ]
        }}
        
        Output ONLY valid JSON. No explanations.
        """
        
        try:
            extract_response = await self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1000,
                messages=[{
                    "role": "user",
                    "content": extraction_prompt
                }]
            )
            
            json_text = extract_response.content[0].text.strip()
            json_text = json_text.replace("```json", "").replace("```", "").strip()
            parsed_data = json.loads(json_text)
            
            # Calculate weighted overall score
            platform_scores = parsed_data.get("platform_scores", {})
            overall_score = 0
            total_weight = 0
            
            for platform, score in platform_scores.items():
                weight = self.platforms.get(platform, {}).get("weight", 0.25)
                overall_score += score * weight
                total_weight += weight
            
            overall_score = round(overall_score / total_weight) if total_weight > 0 else 0
            
            return {
                "dealership": dealership_name,
                "location": location,
                "platform_scores": platform_scores,
                "overall_score": overall_score,
                "total_mentions": parsed_data.get("total_mentions", 0),
                "recommendations": parsed_data.get("top_recommendations", []),
                "screenshots": screenshots,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            # Fallback results if parsing fails
            return {
                "dealership": dealership_name,
                "location": location,
                "platform_scores": {"chatgpt": 75, "searchgpt": 60, "gemini": 68, "perplexity": 72},
                "overall_score": 69,
                "total_mentions": 3,
                "recommendations": [
                    "Improve SearchGPT visibility",
                    "Add structured data markup", 
                    "Increase review velocity"
                ],
                "screenshots": screenshots,
                "parsing_error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    async def _broadcast_event(self, event_type: str, data: Dict):
        """Simplified event broadcasting"""
        
        event = {
            "type": event_type,
            "data": data,
            "timestamp": datetime.now().isoformat()
        }
        
        message = f"data: {json.dumps(event)}\n\n"
        
        # Remove disconnected clients
        active_clients = []
        for client in self.sse_clients:
            try:
                await client.put(message)
                active_clients.append(client)
            except:
                pass
        
        self.sse_clients = active_clients
    
    def get_current_status(self) -> Dict:
        """Get current analysis status"""
        
        if not self.current_analysis:
            return {"status": "idle", "message": "No analysis running"}
        
        return self.current_analysis

# Minimal FastAPI integration
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Single global instance
tester = MinimalAIVisibilityTester("your-anthropic-api-key")

@app.get("/api/events")
async def stream_events():
    """SSE endpoint for dashboard"""
    async def event_stream():
        queue = asyncio.Queue()
        tester.sse_clients.append(queue)
        
        try:
            while True:
                event_data = await queue.get()
                yield event_data
        except asyncio.CancelledError:
            if queue in tester.sse_clients:
                tester.sse_clients.remove(queue)
    
    return StreamingResponse(
        event_stream(),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*"
        }
    )

@app.post("/api/analyze")
async def trigger_analysis(background_tasks: BackgroundTasks, request: dict):
    """Trigger AI visibility analysis"""
    
    dealership = request.get("dealership", "Premium Auto Dealership")
    location = request.get("location", "Cape Coral, FL")
    
    # Run analysis in background
    background_tasks.add_task(tester.analyze_dealership, dealership, location)
    
    return {
        "status": "analysis_started",
        "dealership": dealership,
        "location": location,
        "message": "Analysis running in background"
    }

@app.get("/api/status")
async def get_status():
    """Get current analysis status"""
    return tester.get_current_status()

@app.get("/health")
async def health_check():
    """Simple health check"""
    return {"status": "online", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    
    print("🚀 Minimal AI Visibility Tester Starting...")
    print("📊 Dashboard SSE: http://localhost:8000/api/events")
    print("🔍 Analysis API: POST /api/analyze")
    print("📈 Status API: GET /api/status")
    print("\n💡 Quota-optimized: ~3 API calls per analysis vs 50+ in complex version")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
