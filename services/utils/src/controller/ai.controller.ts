import { GoogleGenAI } from "@google/genai";
import { Request, Response } from "express";
import { careerPrompt } from "../utils/careerPrompt.js";
import { resumePrompt } from "../utils/resumePrompt.js";

export const careerAI = async(req:Request,res:Response) =>{
    try {
        const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY})
        const { skills } = req.body;

        if(!skills){
            return res.status(400).json({
                message: "Skills required!"
            })
        }

        const prompt = careerPrompt(skills)

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        })

        let jsonResponse;

        try {
            const rawText = response.text?.replace(/```json/g, "").replace(/```/g, "").trim()

            if(!rawText){
                throw new Error("Ai did not return valid test response")
            }

            jsonResponse = JSON.parse(rawText);


        } catch (error) {
            return res.status(500).json({
                message: "Ai returned response that was not valid JSON",
                rawResponse: response.text
            })
        }
        res.json(jsonResponse)
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const resumeAnalyzer = async(req:Request,res:Response) =>{
    try {
        const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY})
        const {pdfBase64} = req.body

        if(!pdfBase64) {
            return res.status(400).json({
                message: "PDF data is required!"
            })
        }

        const prompt = resumePrompt

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{
                role: "user",
                parts: [{
                    text: prompt
                },
                {
                    inlineData: {
                        mimeType: "application/pdf",
                        data: pdfBase64.replace(/^data:application\/pdf; base64, /, "")
                    }
                }],
            }]
        })

        let jsonResponse;

        try {
            const rawText = response.text?.replace(/```json/g, "").replace(/```/g, "").trim()

            if(!rawText){
                throw new Error("Ai did not return valid test response")
            }

            jsonResponse = JSON.parse(rawText);


        } catch (error) {
            return res.status(500).json({
                message: "Ai returned response that was not valid JSON",
                rawResponse: response.text
            })
        }
        res.json(jsonResponse)
    
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        })
    }
}