class Hash

  # Return a new hash with all keys converted to symbols, as long as
  # they respond to +to_sym+.
  #
  #   { 'name' => 'Rob', 'years' => '28' }.symbolize_keys
  #   #=> { :name => "Rob", :years => "28" }
  def symbolize_keys
    dup.symbolize_keys!
  end

  # Destructively convert all keys to symbols, as long as they respond
  # to +to_sym+. Same as +symbolize_keys+, but modifies +self+.
  def symbolize_keys!
    keys.each do |key|
      self[(key.to_sym rescue key) || key] = delete(key)
    end
    self
  end

end
