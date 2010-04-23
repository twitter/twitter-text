
module Twitter
  module HitHighlighter
    # Default Tag used for hit highlighting
    DEFAULT_HIGHLIGHT_TAG = "b"
    
    def highlight(text, hits = [])
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
      for hit, index in hits.flatten.each_with_index do
        tag = tags[index % 2]
        
        until hit < prev_chunks_len + chunk.length do
          result << chunk[chunk_cursor..-1] + "<#{chunks[chunk_index+1]}>"
          prev_chunks_len += chunk.length
          chunk_cursor = 0
          chunk_index += 2
          chunk = chunks[chunk_index]
        end
        
        hit_spot = hit - prev_chunks_len
        result << chunk[chunk_cursor...hit_spot] + tag
        chunk_cursor = hit_spot
      end
      
      result << chunk[chunk_cursor..-1]
      for index in chunk_index+1..chunks.length-1
        result << (index.even? ? chunks[index] : "<#{chunks[index]}>")
      end
      
      result
    end
  end
end