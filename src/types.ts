export interface DashboardData {
  summary: {
    total_asvs: number
    total_reads: number
    assigned_asvs: number
    assignment_rate: number
    novel_candidates: number
    high_priority_novel: number
    kingdom_distribution: Record<string, number>
    mean_richness: number
    shannon_diversity: number
    simpson_diversity: number
    abundant_novel: number
    widespread_novel: number
    clustered_novel: number
    top_asvs: Array<{
      asv_id: string
      abundance: number
      assigned: boolean
    }>
  }
  analysis: {
    r1_stats: SequenceStats
    r2_stats: SequenceStats
    automated_decisions: {
      data_type: string
      expected_marker: string
      quality_threshold: number
      quality_comment: string
      min_length: number
      truncLen_r1: number
      truncLen_r2: number
      maxEE: number[]
    }
    timestamp: string
  }
  dada2: {
    total_ASVs: number
    total_reads_final: number
    mean_reads_per_ASV: number
    read_retention_rate: number
    chimera_proportion: number
    sequence_lengths: {
      min: number
      max: number
      median: number
    }
  }
  sampleId: string
}

export interface SequenceStats {
  read_count: number
  mean_length: number
  min_length: number
  max_length: number
  length_std: number
  mean_quality: number
  q20_rate: number
  q30_rate: number
  gc_content: number
  length_distribution: {
    q25: number
    median: number
    q75: number
  }
}

export interface ASVData {
  asv_id: string
  total_reads: number
  sequence_length: number
  similarity_score?: number
  novelty_candidate?: boolean
  cluster_id?: number
}

export interface ClusterData {
  cluster_id: number
  size: number
  mean_similarity: number
  novelty_score: number
  novel_candidates: number
  representative_asvs: string[]
}