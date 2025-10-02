# Data Acquisition Dashboard - Step 1

This directory contains the implementation for Step 1 of the eDNA analysis pipeline: Data Acquisition & Quality Control.

## 📁 Directory Structure

```
data-acquisition/
├── components/
│   ├── SummaryCards.tsx      # Overview metrics cards
│   ├── QualityPlots.tsx      # Interactive quality visualizations
│   ├── WarningsPanel.tsx     # Quality warnings display
│   ├── FileTable.tsx         # File listing with download links
│   └── index.ts              # Component exports
├── DataAcquisitionMain.tsx   # Main dashboard component
└── README.md                 # This file
```

## 🔧 Components Overview

### SummaryCards
Displays key metrics in card format:
- Total reads before/after filtering
- Retention rate
- Quality thresholds
- Read lengths
- GC content
- Pipeline status

### QualityPlots
Interactive visualizations using Recharts:
- Read length distribution (box plot)
- Quality score comparison (bar chart)
- Read retention (pie chart)
- GC content gauge
- Before/after filtering comparison

### WarningsPanel
Shows quality flags and warnings:
- LOW_RETENTION_RATE
- LOW_Q20_RATE
- Other quality issues

### FileTable
Lists files with download functionality:
- Raw FASTQ files
- Processed/trimmed files
- File sizes and descriptions

## 🗂️ Data Sources

The dashboard loads data from these JSON files in `public/data/`:

1. **analysis/data_analysis.json** - Sequence statistics and automated decisions
2. **results/phase1_summary.json** - Processing summary and quality flags
3. **trimmed/fastp_report.json** - Detailed trimming statistics

## 🎨 UI Features

### Status Indicators
- ✅ Ready for DADA2 (green)
- ⚠️ Quality warnings (yellow/red)
- 🔄 Processing status

### Interactive Elements
- Expandable embedded reports (MultiQC, FastP)
- Downloadable files
- Dismissible warnings
- Responsive charts

### Download Options
- Raw FASTQ files
- Analysis summaries (JSON)
- Configuration parameters (.env)
- QC reports (HTML)
- Processed data

## 🔗 Shared Components Used

From `src/components/shared/`:
- **StatusBadge** - Status indicators with icons
- **DownloadSection** - Organized download interface
- **EmbeddedReport** - Iframe-based report viewer

## 📊 Data Visualization

Uses Recharts library for:
- Bar charts (quality comparison, read lengths)
- Pie charts (retention rates)
- Line charts (before/after filtering)
- Custom gauges (GC content)

## 🚀 Usage

The main component `DataAcquisitionMain` automatically:
1. Loads required data files on mount
2. Renders status based on quality flags
3. Provides interactive visualizations
4. Enables file downloads
5. Embeds quality control reports

## 📈 Key Metrics Displayed

- **Read Statistics**: Total reads, retention rate, mean lengths
- **Quality Metrics**: Q20/Q30 rates, mean quality scores
- **Content Analysis**: GC content percentages
- **Processing Results**: Trimming statistics, filtering outcomes
- **File Information**: Sizes, types, download links

## 🔄 Integration

This step feeds into:
- Step 2: ASV Inference (uses trimmed FASTQ files)
- Quality assessment for pipeline continuation
- Parameter validation for downstream steps