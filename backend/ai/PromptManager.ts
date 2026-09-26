/**
 * @file ai/PromptManager.ts
 * @description Centralized prompt template registry, versioning manager, and string interpolator.
 */

import {
  PROMPT_VERSION,
  CLASSIFICATION_PROMPT_TEMPLATE,
  THEME_CLUSTERING_PROMPT_TEMPLATE,
  REPORT_PROMPT_TEMPLATE,
  ASK_LOOP_PROMPT_TEMPLATE,
  SUMMARY_PROMPT_TEMPLATE,
} from "./PromptTemplates";

export type PromptType = "CLASSIFICATION" | "THEME_CLUSTERING" | "REPORT" | "ASK_LOOP" | "SUMMARY";

export class PromptManager {
  private static templates: Map<PromptType, string> = new Map([
    ["CLASSIFICATION", CLASSIFICATION_PROMPT_TEMPLATE],
    ["THEME_CLUSTERING", THEME_CLUSTERING_PROMPT_TEMPLATE],
    ["REPORT", REPORT_PROMPT_TEMPLATE],
    ["ASK_LOOP", ASK_LOOP_PROMPT_TEMPLATE],
    ["SUMMARY", SUMMARY_PROMPT_TEMPLATE],
  ]);

  /**
   * Retrieves the current prompt template version string.
   */
  public static getVersion(): string {
    return PROMPT_VERSION;
  }

  /**
   * Retrieves raw template text for a specific prompt type.
   * @param type Target prompt type identifier
   */
  public static getTemplate(type: PromptType): string {
    const template = this.templates.get(type);
    if (!template) {
      throw new Error(`Prompt template for type '${type}' is not registered in PromptManager.`);
    }
    return template;
  }

  /**
   * Interpolates variable key-value pairs into prompt template placeholders.
   * Placeholders must match {{variableKey}} syntax.
   * @param type Target prompt type identifier
   * @param variables Key-value record for template placeholders
   */
  public static buildPrompt(type: PromptType, variables: Record<string, string>): string {
    let template = this.getTemplate(type);

    for (const [key, val] of Object.entries(variables)) {
      const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g");
      template = template.replace(regex, val);
    }

    return template.trim();
  }
}
