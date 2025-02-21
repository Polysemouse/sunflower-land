import { FrozenPipeline } from "../../pipelines/frozenPipeline";
import { CropsAndChickensScene } from "../CropsAndChickensScene";

export type CropsAndChickensPipeline = "frozen";

/**
 * Initialize all pipelines for the scene.
 * @param scene The CropsAndChickensScene scene.
 */
export const initializePipelines = (scene: CropsAndChickensScene) => {
  const rendererPipelines = (
    scene.renderer as Phaser.Renderer.WebGL.WebGLRenderer
  ).pipelines;

  // define all pipelines here
  const pipelineActions: Record<CropsAndChickensPipeline, () => void> = {
    frozen: () =>
      rendererPipelines?.add("frozen", new FrozenPipeline(scene.game)),
    // add other pipelines here
  };

  // add all pipelines to pipeline
  const pipelines = Object.keys(pipelineActions) as CropsAndChickensPipeline[];
  pipelines.forEach((pipeline) => {
    pipelineActions[pipeline]?.();
  });
};
