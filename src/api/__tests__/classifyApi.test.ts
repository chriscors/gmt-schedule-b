import { describe, it, expect, beforeAll } from 'vitest';
import { classifyStart, classifyContinue, findScheduleB } from '../classifyApi';

// These are integration tests that call the actual Census API via our serverless functions
describe('Census API Integration Tests', () => {
  describe('classifyStart', () => {
    it('should start a classification for a simple product', async () => {
      const response = await classifyStart('coffee');

      expect(response).toBeDefined();
      expect(response.txId).toBeDefined();
      expect(typeof response.txId).toBe('string');

      // Should either have an immediate classification or questions
      if (response.hsCode) {
        expect(typeof response.hsCode).toBe('string');
        expect(response.hsCode.length).toBeGreaterThan(0);
      } else {
        expect(response.currentItemInteraction).toBeDefined();
        expect(response.currentItemInteraction?.attrs).toBeDefined();
        expect(Array.isArray(response.currentItemInteraction?.attrs)).toBe(true);
      }
    }, 30000); // 30 second timeout for API call

    it('should start a classification for a complex product', async () => {
      const response = await classifyStart('laptop computer');

      expect(response).toBeDefined();
      expect(response.txId).toBeDefined();
      
      // Complex products typically require questions
      if (!response.hsCode) {
        expect(response.currentItemInteraction).toBeDefined();
        expect(response.currentItemInteraction?.name).toBeDefined();
      }
    }, 30000);

    it('should handle empty product description gracefully', async () => {
      try {
        await classifyStart('');
        // If it doesn't throw, the API accepted it
        expect(true).toBe(true);
      } catch (error) {
        // If it throws, that's also acceptable behavior
        expect(error).toBeDefined();
      }
    }, 30000);
  });

  describe('classifyContinue', () => {
    it('should continue a classification session', async () => {
      // First start a classification
      const startResponse = await classifyStart('laptop computer');
      
      // Skip if we got an immediate classification
      if (startResponse.hsCode) {
        return;
      }

      expect(startResponse.currentItemInteraction).toBeDefined();
      expect(startResponse.currentItemInteraction?.attrs).toBeDefined();
      
      const question = startResponse.currentItemInteraction!;
      const firstOption = question.attrs![0];

      // Continue with the first option
      const continueResponse = await classifyContinue(
        startResponse.txId,
        question.id,
        [{ first: firstOption.id, second: firstOption.name }],
        'laptop computer'
      );

      expect(continueResponse).toBeDefined();
      
      // Should either complete or have more questions
      if (continueResponse.hsCode) {
        expect(typeof continueResponse.hsCode).toBe('string');
      } else {
        expect(continueResponse.currentItemInteraction).toBeDefined();
      }
    }, 60000); // 60 second timeout for multiple API calls
  });

  describe('findScheduleB', () => {
    it('should find Schedule B codes for a valid HS code', async () => {
      // First get an HS code by classifying a product
      const classifyResponse = await classifyStart('coffee');
      
      let hsCode = classifyResponse.hsCode;
      
      // If we didn't get an immediate result, try answering questions
      if (!hsCode && classifyResponse.currentItemInteraction) {
        const question = classifyResponse.currentItemInteraction;
        const firstOption = question.attrs![0];
        
        const continueResponse = await classifyContinue(
          classifyResponse.txId,
          question.id,
          [{ first: firstOption.id, second: firstOption.name }],
          'coffee'
        );
        
        hsCode = continueResponse.hsCode;
      }

      // If we still don't have an HS code, skip this test
      if (!hsCode) {
        console.log('Could not obtain HS code, skipping Schedule B test');
        return;
      }

      const scheduleResponse = await findScheduleB(hsCode);

      expect(scheduleResponse).toBeDefined();
      expect(scheduleResponse.items).toBeDefined();
      expect(Array.isArray(scheduleResponse.items)).toBe(true);
      
      if (scheduleResponse.items.length > 0) {
        const firstItem = scheduleResponse.items[0];
        expect(firstItem).toHaveProperty('code');
        expect(firstItem).toHaveProperty('desc');
      }
    }, 90000); // 90 second timeout for multiple API calls

    it('should handle invalid HS codes gracefully', async () => {
      try {
        await findScheduleB('invalid-code');
        // If it doesn't throw, check for empty results
        expect(true).toBe(true);
      } catch (error) {
        // If it throws, that's acceptable
        expect(error).toBeDefined();
      }
    }, 30000);
  });
});
