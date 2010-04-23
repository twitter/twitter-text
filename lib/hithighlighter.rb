
module Twitter
  # Module for doing "hit highlighting" on tweets that have been auto-linked already.  
  # Useful with the results returned from the Search API.
  module HitHighlighter
    # Default Tag used for hit highlighting
    DEFAULT_HIGHLIGHT_TAG = "em"
    
    # Add <tt><em></em></tt> tags around the <tt>hits</tt> provided in the <tt>text</tt>. The
    # <tt>hits</tt> should be an array of (start, end) index pairs, relative to the original
    # text, before auto-linking (but the <tt>text</tt> may already be auto-linked if desired)
    def hit_highlight(text, hits = [])
      if hits.empty?
        return text
      end
      
      chunks = text.split("<").map do |item|
        item.blank? ? item : item.split(">")
      end.flatten
      
      tags = ["<" + DEFAULT_HIGHLIGHT_TAG + ">", "</" + DEFAULT_HIGHLIGHT_TAG + ">"]
      
      result = ""
      chunk_index, chunk = 0, chunks[0]
      prev_chunks_len = 0
      chunk_cursor = 0
      start_in_chunk = false
      for hit, index in hits.flatten.each_with_index do
        tag = tags[index % 2]
        
        placed = false
        until hit < prev_chunks_len + chunk.length do
          result << chunk[chunk_cursor..-1] 
          if start_in_chunk && hit == prev_chunks_len + chunk.length
            result << tag
            placed = true
          end
          result << "<#{chunks[chunk_index+1]}>"
          prev_chunks_len += chunk.length
          chunk_cursor = 0
          chunk_index += 2
          chunk = chunks[chunk_index]
          start_in_chunk = false
        end
        
        if !placed
          hit_spot = hit - prev_chunks_len
          result << chunk[chunk_cursor...hit_spot] + tag
          chunk_cursor = hit_spot
          if index % 2 == 0
            start_in_chunk = true
          end
        end
      end
      
      result << chunk[chunk_cursor..-1]
      for index in chunk_index+1..chunks.length-1
        result << (index.even? ? chunks[index] : "<#{chunks[index]}>")
      end
      
      result
    end
  end
end